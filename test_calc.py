import unittest
import calc
import tng

class SingleFileTestScript(tng.api.TestCase):

    @classmethod
    def setUpClass(cls):
        """
        Override the setUpClass method built into TNG.
        setUpClass() runs once at the beginning of the test suite.

        This is an optional method and doesn't need to be present, but you
        could add things here.

        :return: nothing
        """
        # Call the setUpClass method(s) of the parent class(es)

    def setUp(self):
        """
        Override the setUp method built into TNG.
        setUp() runs before the beginning of each unit test.

        This is an optional method and doesn't need to be present, but you
        could add things here.

        :return: nothing
        """
    def test_add(self):
        self.assertEqual(calc.add(10, 5), 15)


    def test_multiply(self):
        self.assertEqual(calc.multiply(10, 5), 50)

    def test_divide(self):
        self.assertEqual(calc.divide(10, 5), 2)

    def tearDown(self):
        """
        Override the tearDown method built into TNG.
        tearDown() runs after the end of each unit test.

        This is an optional method and doesn't need to be present, but you
        could add things here.

        :return:
        """

    @classmethod
    def tearDownClass(cls):
        """
        Override the tearDownClass method built into TNG.
        tearDownClass() runs once at the end of the test suite.
        NOTE: tearDownClass() will not run if there is a failure in setUpClass().

        This is an optional method and doesn't need to be present, but you
        could add things here.

        :return: nothing
        """

'''

class TestCalc(unittest.TestCase):

    def test_add(self):
        self.assertEqual(calc.add(10, 5), 15)


    def test_multiply(self):
        self.assertEqual(calc.multiply(10, 5), 50)

    def test_divide(self):
        self.assertEqual(calc.multiply(10, 5), 4)



'''


def main():
    """
    Main Function that executes the tests using the TNG framework.
    """
    tng.api.runner()

if __name__ == '__main__':
    tng.run(main)
