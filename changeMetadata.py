# https://stackoverflow.com/q/17140886/

import os

directory = './outputCopy'

# loop through files
for filename in os.listdir(directory):
	# only alter metadata
	if filename.endswith((".json")):
		print(filename)

		filepath = os.path.join(directory, filename)

		# read in metadata
		with open(filepath, 'r') as file:
			metadata = file.read()
		
		print(metadata)
		# Replace whatever with whatever
		metadata = metadata.replace('"description":"Bear rugs not drugs"', '"description":"Bear Rug Collective"')

		# Write the file out again
		with open(filepath, 'w') as file:
			file.write(metadata)