/* Simple C program for implementation of FCFS scheduling */

#include<stdio.h>
#include "schedulingAlgorithms.h"

// main function
int main()
{
    // process ids
    int processes[] = { 1, 2, 3, 4};
    int n = sizeof processes / sizeof processes[0];

    // burst time of all processes
    int  burst_time[] = {21, 3, 6, 2};

    findAverageTime(processes, n,  burst_time);

    return 0;
}
