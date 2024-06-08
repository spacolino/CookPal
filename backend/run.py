from app import create_app
from apscheduler.schedulers.background import BackgroundScheduler
from app.scheduler import reset_daily_tokens

app = create_app()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=reset_daily_tokens, trigger="interval", days=1)
    scheduler.start()

if __name__ == '__main__':
    start_scheduler()
    app.run(debug=True)
