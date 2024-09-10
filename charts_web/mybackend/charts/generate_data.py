import random
from datetime import timedelta

# Generating random candlestick data
def generate_candlestick_data(start_date, num):
    data = []
    current_date = start_date
    for _ in range(num):
        open_price = random.randint(20, 50)
        close_price = open_price + random.randint(-10, 10)
        high_price = max(open_price, close_price) + random.randint(0, 5)
        low_price = min(open_price, close_price) - random.randint(0, 5)
        
        data.append({
            "x": current_date.strftime("%Y-%m-%d"),
            "open": open_price,
            "high": high_price,
            "low": low_price,
            "close": close_price
        })
        current_date += timedelta(days=1)
    return data
