import sys

birthdates = [1990, 1963, 1970, 1967, 1988, 1990, 1964, 1935, 1937, 1965]
names = ["gm", "gob", "Buster", "Michael", "SteveHolt", "Maeby", "Tobias", "GeorgeSr", "LucilleBluth", "Lindsay"]

for i, name in enumerate(names):
    print '%s =  "" * %s + (%s left)' % (name, birthdates[i] - 1930, 2008 - birthdates[i])

sys.exit()

people = []
for i, birthdate in enumerate(birthdates):
    people.append([names[i], birthdate, []])

people = sorted(people, key = lambda person: person[1])
# print sorted_list

time_labels = []
for year in range(1930, 2008):
    # Append time to time list
    time_labels.append(str(year))

    # Append age to age list of each person's object
    for person in people:
        age = year - person[1] + 1
        if age > 0:
            person[2].append(age)
        else:
            person[2].append(0)

# Now that all of the ages are appended, output the data
outfile = open("arrested.txt", 'w')
setname = "dataset2"
outfile.write(setname + ".dataSheets = new Array(")
for person in people:
    outfile.write("\"" + person[0] + "\", ")
outfile.write("\n");

outfile.write(setname + ".timeLabels = new Array(")
for year in time_labels:
    outfile.write("\"" + year + "\", ")
outfile.write("\n")

outfile.write(setname + ".columnLabels = new Array(\"Age\")")
outfile.write("\n")

outfile.write(setname + ".columnDataPerSheet = ")
outfile.write("\n")
outfile.write("\t[\n")
for person in people:
    outfile.write("\t\t[")
    for age in person[2]:
        outfile.write(str(age) + ", ")
    outfile.write("],\n")
outfile.write("\t];\n");
