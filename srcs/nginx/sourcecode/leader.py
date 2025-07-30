#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'climbingLeaderboard' function below.
#
# The function is expected to return an INTEGER_ARRAY.
# The function accepts following parameters:
#  1. INTEGER_ARRAY ranked
#  2. INTEGER_ARRAY player
#

def getRanking(ranked, rank):
    print(rank)
    unique = list(dict.fromkeys(ranked))
    res = 1
    for r in unique:
        if rank < r:
            res += 1
    return res

def climbingLeaderboard(ranked, player):
    res = []
    for ele in player:
        res += [getRanking(ranked, ele)]
    return res
    # Write your code here

if __name__ == '__main__':
    
    ranked = [100, 90, 90, 80, 75, 60]
    player = [50, 65, 77, 90, 102]
    result = climbingLeaderboard(ranked, player)
    print(result)