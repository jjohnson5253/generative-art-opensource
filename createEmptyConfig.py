
import os

firstPart = '{"program":{"uuid":"8rpSue","config":"8rpSueSmk96niXtDVKxbrh2QKMZNTWiQipn7ebgjTtK9"},"items":{'
emptyItem = '{},'
lastEmptyItem = '{}}'

with open("emptyConfig", 'w') as file:

    # write the first part of config file
    file.write(firstPart)

    # add empty items
    for i in range(887):
        file.write(emptyItem)

    file.write(lastEmptyItem)
