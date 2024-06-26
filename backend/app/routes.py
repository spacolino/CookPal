from openai import OpenAI
from flask import Blueprint, request, jsonify, redirect, url_for, session, current_app
from flask_login import login_user, logout_user, login_required, current_user
from .extensions import db, bcrypt, oauth
from .models import Ingredient, User
from .middleware import check_token_limit
import os

main = Blueprint('main', __name__)

# Load OpenAI API key
client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY'],  # this is also the default, it can be omitted
)

@main.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    login_user(user)
    return jsonify({'message': 'Logged in successfully'}), 200

@main.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@main.route('/ingredients', methods=['POST'])
@login_required
def add_ingredient():
    data = request.get_json()
    name = data.get('name')
    quantity = data.get('quantity', 'Not specified')

    ingredient = Ingredient(name=name, quantity=quantity, user_id=current_user.id)
    db.session.add(ingredient)
    db.session.commit()

    return jsonify({'message': 'Ingredient added', 'id': ingredient.id}), 201

@main.route('/ingredients', methods=['GET'])
@login_required
def get_ingredients():
    ingredients = Ingredient.query.filter_by(user_id=current_user.id).all()
    return jsonify({'ingredients': [{'id': ing.id, 'name': ing.name, 'quantity': ing.quantity} for ing in ingredients]}), 200

@main.route('/ingredients/<int:id>', methods=['DELETE'])
@login_required
def delete_ingredient(id):
    ingredient = Ingredient.query.get_or_404(id)
    if ingredient.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(ingredient)
    db.session.commit()
    return jsonify({'message': 'Ingredient deleted'}), 200

@main.route('/suggest-recipe', methods=['POST'])
@login_required
@check_token_limit
def suggest_recipe():
    data = request.get_json()
    ingredients = data.get('ingredients', [])

    if not ingredients:
        return jsonify({'error': 'No ingredients provided'}), 400

    ingredients_list = '\n'.join([f"{ing['name']}: {ing['quantity']}" for ing in ingredients])
    # Fetch recipe from OpenAI GPT-4o
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a cooking assistant, skilled in explaining creative recipes with creative flair."},
            {"role": "user", "content": f"Suggest a recipe using only the following ingredients: \n {ingredients_list}\n\n Format the recipe as follows: \n 1. A short introduction.\n 2. A list of ingredients.\n 3. Step-by-step instructions.\n\nRecipe:"},
        ]            
    )

    recipe_text = response.choices[0].message.content

    # Fetch image from OpenAI DALL-E       
    dalle_response = client.images.generate(
        model="dall-e-3",
        prompt=f"A delicious dish made with: \n {ingredients_list}.",
        n=1,
        size="1024x1024",
        quality="standard"
    )

    image_url = dalle_response.data[0].url
    return jsonify({'recipe': recipe_text, 'image_url': image_url})  

@main.route('/auth/google')
def google_login():
    redirect_uri = url_for('main.google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@main.route('/auth/callback')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.parse_id_token(token)
    user = User.query.filter_by(email=user_info['email']).first()

    if user is None:
        user = User(username=user_info['name'], email=user_info['email'])
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect('http://localhost:3000')  # Redirect to your frontend app