# Parses a sample data file into the format expected by the stereo visualizer

import sys

infilename = "sample_data_to_parse.txt"
outfilename = "parsed.txt"

infile = open(infilename, 'r')
outfile = open(outfilename, 'w')

datasheets = []
timeLabels = []
variableNames = []
axisLabels = []
variableValues = []
columnMaxValues = []
datasetName = ""

# Configure this according to the circumstance
datasetInternalName = 'dataset1'

# Read dataset name
if (infile.readline().strip() == "==Dataset Name=="):
    print "Reading dataset name..."
    datasetName = infile.readline().strip()
else:
    print "Error! Dataset name header not found."
    sys.exit(-1)

infile.readline()
# Read labels
if (infile.readline().strip() == "==Datasheet Labels=="):
    print "Reading datasheets..."
    line = infile.readline().strip()
    while(line != ""):
        datasheets.append(line)
        line = infile.readline().strip()
    # print datasheets
else:
    print "Error! datasheet header not found."
    sys.exit(-1)

# Read time labels
if (infile.readline().strip() == "==Labels for Each Point in Time=="):
    print "Reading time labels..."
    line = infile.readline().strip()
    while(line != ""):
        timeLabels.append(line)
        line = infile.readline().strip()
    # print timeLabels
else:
    print "Error! Time label header not found."

# Read variables until the end of the file
line = infile.readline().strip()
while(line != ""):
    if (line == "==Variable Name=="):
        variableNames.append(infile.readline().strip())
    else:
        print "Error! Variable name header expected."
        sys.exit(-1)
    
    infile.readline()
    line = infile.readline().strip()
    axisLabelsForThisVariable = []
    if (line == "==Name for When This Variable Is Positive (for Axis Label)=="):
        axisLabelsForThisVariable.append(infile.readline().strip())
    else:
        print "Error! Positive axis name header expected."
        sys.exit(-1)
    
    infile.readline()
    line = infile.readline().strip()
    if (line == "==Name for When This Variable Is Negative (for Axis Label)=="):
        axisLabelsForThisVariable.append(infile.readline().strip())
    else:
        print "Error! Negative axis name header expected."
        sys.exit(-1)

    axisLabels.append(axisLabelsForThisVariable)
    
    infile.readline()
    line = infile.readline().strip()
    if (line == "==Max Value for This Variable on the Graph (Determines Bar Height)=="):
        columnMaxValues.append(infile.readline().strip())
    else:
        print "Error! Max value header expected."
        sys.exit(-1)
    infile.readline()
    line = infile.readline().strip()

    vals = []
    if (line == "==Variable Data (all time points on one line, one line per data column)=="):
        for i in range(len(datasheets)):
            vals.append(infile.readline().strip().split(' '))
        variableValues.append(vals)
    else:
        print "Error! Variable values header expected."
        sys.exit(-1)
    infile.readline()
    line = infile.readline().strip()

# Write out dataset name
outfile.write(datasetInternalName + '.name = "' + datasetName + '";\n')

# Write out datasheet labels
datasheetsString = datasetInternalName + '.dataSheets = new Array('
for name in datasheets:
    datasheetsString += '"' + name + '", '
datasheetsString = datasheetsString[:-2] + ');\n'
outfile.write(datasheetsString)

# Write out time labels
timeLabelsString = datasetInternalName + '.timeLabels = new Array('
for label in timeLabels:
    timeLabelsString += '"' + label + '", '
timeLabelsString = timeLabelsString[:-2] + ');\n'
outfile.write(timeLabelsString)

# Write out column labels (variable names)
variableNamesString = datasetInternalName + '.columnLabels = new Array('
for name in variableNames:
    variableNamesString += '"' + name + '", '
variableNamesString = variableNamesString[:-2] + ');\n'
outfile.write(variableNamesString)

# Write out axis labels
axisLabelString = datasetInternalName + '.axisLabels = new Array('
for labelSet in axisLabels:
    axisLabelString += '["' + labelSet[0] + '", "' + labelSet[1] + '"], '
axisLabelString = axisLabelString[:-2] + ');\n'
outfile.write(axisLabelString)

# Write out column max values
columnMaxValuesString = datasetInternalName + '.columnMaxValues = new Array('
for value in columnMaxValues:
    columnMaxValuesString += '' + value + ', '
columnMaxValuesString = columnMaxValuesString[:-2] + ');\n'
outfile.write(columnMaxValuesString)

# Write out column data values
columnValueString = datasetInternalName + '.columnDataPerSheet =\n    [\n'
for datasheetNo in range(len(datasheets)):
    columnValueString += '        ['
    for variableNo in range(len(variableNames)):
        columnValueString += '['
        for timeLabelNo in range(len(timeLabels)):
            valueToAdd = variableValues[variableNo][datasheetNo][timeLabelNo]
            if (valueToAdd == ':'):
                valueToAdd = '""'
            columnValueString += valueToAdd + ', '
        columnValueString = columnValueString[:-2] + '], '
    columnValueString = columnValueString[:-2] + '],\n'
columnValueString += '    ];\n'
outfile.write(columnValueString)





