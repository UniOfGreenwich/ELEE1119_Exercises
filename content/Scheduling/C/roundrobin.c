#include<stdio.h>
#include "schedulingAlgorithms.h"

//Given below is the Driver Code
int main() 
{ 
	// process id's 
	int processes[] = { 1, 2, 3,4}; 
	int x = sizeof processes / sizeof processes[0]; 

	// Burst time of all processes 
	int burst_time[] = {21, 13, 6,12}; 

	// Time quantum 
	int quantum = 2; 
	findRRavgTime(processes, x, burst_time, quantum); 
	return 0; 
} 