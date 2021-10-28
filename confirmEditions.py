# https://stackoverflow.com/q/17140886/

import os

directory = './output_test'
fileCnt=0

# string to hold all metadata
allMetaData = ""

# loop through files and get metadata
for filename in os.listdir(directory):
	# only use json metadata files
	if filename.endswith((".json")):
		fileCnt=fileCnt+1

		filepath = os.path.join(directory, filename)

		# read in metadata
		with open(filepath, 'r') as file:
			metadata = file.read()
		
		# add metadata to one big string
		allMetaData+=metadata

#cnt=0

print("file numbers not found:")
for i in range(8888, 9776):
	if str(i) not in allMetaData:
		print(i)
		#cnt=cnt+1

# print num of files searched
print()
print("files searched:")
print(fileCnt)

#print("matches:")
#print(cnt)