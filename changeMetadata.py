# https://stackoverflow.com/q/17140886/

import os

directory = './change_metadata'
fileCnt=0
fileChangeCnt=0

toReplace = ',"external_url":"https://www.bearrugsnft.xyz/"'
replaceWith = ''

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
		
		if toReplace in metadata:
			fileChangeCnt = fileChangeCnt + 1
		# Replace whatever with whatever
		metadata = metadata.replace(toReplace, replaceWith)

		# Write the file out again
		with open(filepath, 'w') as file:
			file.write(metadata)

# print num of files changed
print("files found:")
print(fileCnt)

# print num of files changed
print("files changed:")
print(fileChangeCnt)