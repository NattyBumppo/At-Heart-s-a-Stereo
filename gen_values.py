import random

outfile = open("countries.txt", "w")

for i in range(10):
	string = "["
	for j in range(20):
		string += str(random.randrange(-100, 100))
		string += ", "
	string = string[:-2] + "]"
	outfile.write(string + "\n")