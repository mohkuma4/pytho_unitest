import unittest
import calc


class TestCalc(unittest.TestCase):

    def test_add(self):
        self.assertEqual(calc.add(10, 5), 15)


    def test_multiply(self):
        self.assertEqual(calc.multiply(10, 5), 50)

    def test_divide(self):
        self.assertEqual(calc.multiply(10, 5), 4)







if __name__ == '__main__':
    unittest.main()
