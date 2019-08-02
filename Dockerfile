FROM python:3
ADD * /
CMD ["python run", "./test_calc.py"]

