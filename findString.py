# https://stackoverflow.com/q/17140886/

import os

directory = './change_metadata'
fileCnt=0
matchesFound=0

toFind = 'Bear Rug 1111'

# loop through files
for filename in os.listdir(directory):
	# only alter metadata
	if filename.endswith((".json")):
		fileCnt=fileCnt+1
		#print(filename)

		filepath = os.path.join(directory, filename)

		# read in metadata
		with open(filepath, 'r') as file:
			metadata = file.read()
		
		if toFind in metadata:
			matchesFound = matchesFound + 1

		# Write the file out again
		with open(filepath, 'w') as file:
			file.write(metadata)

# print num of files changed
print("files searched:")
print(fileCnt)

# print num of files changed
print("Matches found")
print(matchesFound)