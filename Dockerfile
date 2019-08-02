FROM python:3
ADD * /
CMD ["tng run", "./test_calc.py"]
