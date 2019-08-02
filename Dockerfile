FROM python:3
ADD test_calc.py /
ADD calc.py /
CMD ["python", "./test_calc.py"]
