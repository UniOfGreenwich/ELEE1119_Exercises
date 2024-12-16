/* Simple C program for implementation of FCFS scheduling */

#include<stdio.h>
#include "schedulingAlgorithms.h"

// main function
int main()
{
    int n; // number of processes
    printf("Enter the number of processes: ");
    scanf("%d", &n);

    int processes[n]; // array to store process IDs
    int burst_time[n]; // array to store burst times

    // taking user input for burst times
    printf("Enter burst times for %d processes:\n", n);
    for (int i = 0; i < n; i++)
    {
        printf("Burst time for process %d: ", i + 1);
        scanf("%d", &burst_time[i]);
        processes[i] = i + 1;
    }

    findAverageTime(processes, n, burst_time);

    return 0;
}
