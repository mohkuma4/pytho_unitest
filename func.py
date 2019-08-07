'''
*args - used to pass list to fns
**kwargs- used to pass dicts

docstring used to document functions. 

""" foo bar """---- > docstring

'''

def stud_info(*args, **kwargs):
	""" this is args and kwargs demo prog"""
	print(args)
	print(kwargs)
	
	
names=['somesh','mohan']	
info={'rel' : 'bros', 'place' : 'Bengaluru'}

#stud_info(*names,**info)
