# System Calls

In this Lab you are going to use `shell` commands and write some programs in `c` to understand the concepts of system calls. 

>**Note:**
>> You are to use a linux system with the `gcc` compiler installed.
>> Prerequistes: [Learning C](../Learning_C/Learning_C.md)

## Task 1 - `excelp()`

 1. Open a terminal.
 
 2. change directory to `ELEE1119/Learning_C/`
    - `$ cd ELEE1119/Learning_C`
 
 3. make a directory called SystemCalls and change direcory 
    - `$ mkdir SystemCalls && cd SystemCalls`
 
 4. Now create a file called `my_ps.c`
    - `$ nano my_ps.c`

Reproduce the following code: 

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main()
{
  printf("ps with execlp\n");
  execlp("ps", "ps", 0); //if error do NULL instead of 0 
  printf("Done.\n");
  exit(0);
}

```

Once entered use the keyboard shortcut to `writeout` <kbd>ctrl</kbd>+<kbd>o</kbd> and then press the <kbd>Enter</kbd> followed by <kbd>ctrl</kbd>+<kbd>x</kbd> to exit the file.  

Now you need to compile the code:

```sh
$ gcc my_ps.c -o my_ps
```

Now, you can run it: 

```sh
$ ./my_ps
```

Output: 

```sh
ps with execlp
  PID TTY          TIME CMD
12377 pts/0    00:00:00 bash
18304 pts/0    00:00:00 ps
```

When you run it, you get the usual `ps` output without "Done." message at all. Also, there is no reference to a process called `my_ps` in the output.

The code prints the first message, `ps with execlp`, and then calls `execlp()`, which searches the directories given by the `PATH` environmet variable for a program called `ps`. It then executes `ps` in place of `my_ps`, starting it as if you had issued the shell command:

```sh
$ ps
```
So, when `ps` finishes, you get a new shell prompt. You don't return to `my_ps`. Thus, the second message, "Done.", doesn't get printed. The `PID` of the new process is the same as the original, as are the parent `PID` and `nice` value.

To use processes to perform more than one function at a time, you can either use threads or create an extirely separate process from within a program, as `init` does, rather than replace the current thread of execution, `exec`, as shown in the above example.

## Task 1.2 - `fork()` with `execv()`

In the following code, `fork()` on parent process creates child process, and then the child itself run `execv()` to replace the parent code with a new code specified in the path.

Create a new file called `fork_execv.c`

```sh
$ nano fork_execv.c
```

Reprodce the code:

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>


void main(char *path, char *argv[]) 
{ 
    int pid = fork(); 
    if (pid == 0) 
    { 
        printf("Child\n"); 
        execv(path, argv); 
    } 
    else 
    { 
        printf("Parent %d\n", pid); 
    } 
    printf("Parent prints this line \n"); 
} 
```

Again `writeout` and compile:

```sh
$ gcc fork_execv.c -o fork_execv
```

Run it:

```sh
$ ./fork_execv
```

Output: 

```sh
Parent 105
Parent prints this line 
Child
Parent prints this line
```

## Task 2: `fork()` in depth


System call `fork()` takes **no** arguments and returns a process ID. The purpose of `fork()` is to create a new process, which becomes the child process of the caller. After a new child process is created, both processes will execute the next instruction following the `fork()` system call. Therefore, you have to distinguish the parent from the child. This can be done by testing the returned value of `fork()`:

1. returns a negative value, the creation of a child process was unsuccessful.
   
2. returns a zero to the newly created child process.
   
3. returns a positive value, the process ID of the child process, to the parent. The returned process ID is of type `pid_t` defined in `sys/types.h`. Normally, the process ID is an `int`. Moreover, a process can use function `getpid()` to retrieve the process ID assigned to this process.


Create a new file called, `fork_indepth.c`

```sh
$ nano fork_indepth.c
```

Now reproduce the following code:

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUF_SIZE 150

int main()
{
  int pid = fork();
  char buf[BUF_SIZE];
  int print_count;

  switch (pid)
  {
    case -1:
      perror("fork failed");
      exit(1);
    case 0:
      /* When fork() returns 0, you are in the child process. */
      print_count = 10;
      sprintf(buf,"child process: pid = %d", pid);
      break;
    default: /* + */
      /* When fork() returns a positive number, you are in the parent process
       * (the fork return value is the PID of the newly created child process) */
      print_count = 5;
      sprintf(buf,"parent process: pid = %d", pid);
      break;
  }
  for(;print_count > 0; print_count--) {
      puts(buf);
      sleep(1);
  }
  exit(0);
}
```

Compile and run:

```sh
$ gcc fork_indepth.c -o fork_indepth
$ ./fork_indepth
```

Output:

```sh
parent process: pid = 165
child process: pid = 0
parent process: pid = 165
child process: pid = 0
parent process: pid = 165
child process: pid = 0
parent process: pid = 165
child process: pid = 0
parent process: pid = 165
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
```


As you can see from the output, the call to `fork()` in the parent returns the `PID` of the new child process. The new process continues to execute just like the old, with the exception that in the child process the call to `fork()` returns 0.

When you start a child process with `fork()`, it runs independently. But sometimes, you want to find out when a child process has finished. If the parent finishes ahead of the child, as the case in the example above, you may get confused, and it may not what you want to happen. So, you need to arrange for the parent process to wait until the child finishes by calling `wait()`.

## Task 3: `fork` and `wait()` 

The execution of `wait()` could have two possible situations.

1. If there are at least one child processes running when the call to `wait()` is made, the caller will be blocked until one of its child processes exits. At that moment, the caller resumes its execution.

2. If there is no child process running when the call to `wait()` is made, then this `wait()` has no effect at all. That is, it is as if no `wait()` is there.

The `wait(&status)` system call has two purposes.

1. If a child of this process has not yet terminated by calling `exit()`, then `wait()` suspends execution of the process until one of its children has terminated.

2. The termination status of the child is returned in the status argument of `wait()`.

Open a new file called `fork_n_wait.c`

```sh
$ nano fork_n_wait.c
```

The code you need to reproduce is very similar to the previous script, but with `wait()` implemented.

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUF_SIZE 150

int main()
{
  int pid = fork();
  char buf[BUF_SIZE];
  int print_count;

  switch (pid)
  {
    case -1:
      perror("fork failed");
      exit(1);
    case 0:
      print_count = 10;
      sprintf(buf,"child process: pid = %d", pid);
      break;
    default:
      print_count = 5;
      sprintf(buf,"parent process: pid = %d", pid);
      break;
  }
  if(!pid) {
    int status;
    int pid_child = wait(&status);
  }
  for(;print_count > 0; print_count--) puts(buf);
  exit(0);
}
```

Again you need to compile:

```sh
$ gcc fork_n_wait.c -o fork_n_wait
```

Ignore the following message if you see it: 

```sh
fork_n_wait.c: In function ‘main’:
fork_n_wait.c:30:21: warning: implicit declaration of function ‘wait’ [-Wimplicit-function-declaration]
   30 |     int pid_child = wait(&status);
      |           
```
Now run and you should a different output to previous script.

```sh
$ ./fork_n_wait
```

Output:

```
parent process: pid = 191
parent process: pid = 191
parent process: pid = 191
parent process: pid = 191
parent process: pid = 191
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
child process: pid = 0
```

The parent process is now using the `wait()` system call to suspend its own execution by checking the return value from the call.

## Task 4 - Day-Z

Zombie processes don’t use up any system resources. (Actually, each one uses a very tiny amount of system memory to store its process descriptor.) However, each zombie process retains its process ID (PID). 

Linux systems have a finite number of process IDs — 32767 by default on 32-bit systems. 

If zombies are accumulating at a very quick rate — for example, if improperly programmed server software is creating zombie processes under load — the entire pool of available PIDs will eventually become assigned to zombie processes, preventing other processes from launching.

However, a few zombie processes hanging around are no problem — although they do indicate a bug with their parent process on your system.

Create a new script called `zombie.c`

```sh
$ nano zombie.c
```

Reproduce the following code:

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUF_SIZE 150

int main()
{
  int pid = fork();
  char buf[BUF_SIZE];
  int print_count;

  switch (pid)
  {
    case -1:
      perror("fork failed");
      exit(1);
    case 0:
      print_count = 2;
      sprintf(buf,"child process: pid = %d", pid);
      break;
    default:
      print_count = 4;
      sprintf(buf,"parent process: pid = %d", pid);
      break;
  }
  for(;print_count > 0; print_count--) {
      puts(buf);
      system("ps -la | grep zombie | grep -v grep"); 
      sleep(1);
  }
  exit(0);
}
```

Compile the code:

```sh
$ gcc zombie.c -o zombie
```

If you run the code above, the child process will finish its task ahead of parent process, and will exist as a zombie until the parent finishes as shown in the output below:

```sh
$ ./zombie
```

Output: 
```sh
parent process: pid = 404
child process: pid = 0
0 S  1000   403    54  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
1 S  1000   404   403  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
0 S  1000   403    54  0  80   0 -   691 hrtime pts/0    00:00:00 zombie
1 S  1000   404   403  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
parent process: pid = 404
child process: pid = 0
0 S  1000   403    54  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
1 D  1000   404   403  0  80   0 -   700 do_for pts/0    00:00:00 zombie
1 R  1000   417   404  0  80   0 -   700 -      pts/0    00:00:00 zombie
0 S  1000   403    54  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
1 S  1000   404   403  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
parent process: pid = 404
0 S  1000   403    54  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
1 Z  1000   404   403  0  80   0 -     0 -      pts/0    00:00:00 zombie <defunct>
parent process: pid = 404
0 S  1000   403    54  0  80   0 -   691 do_wai pts/0    00:00:00 zombie
1 Z  1000   404   403  0  80   0 -     0 -      pts/0    00:00:00 zombie <defunct>
```

You can't kill zombie processes as you can kill normal processes with the `SIGKILL` signal - zombie processes are already dead. Regarding zombies, UNIX systems imitate the movies - a zombie process can't be killed by a signal, not even the (silver bullet) `SIGKILL`. Actually, this was the intentional feature to ensure that the parent can always eventually perform a `wait()`. Bear in mind that you don't need to get rid of zombie processes unless you have a large amount on our system - a few zombies are harmless. However, there are a few ways we can get rid of zombie processes.

One way is by sending the `SIGCHLD` signal to the parent process. This signal tells the parent process to execute the `wait()` system call and clean up its zombie children. Send the signal with the `kill` command, replacing `pid` in the command below with the parent process's `PID`:

```sh
kill -s SIGCHLD pid
```

However, if the parent process isn't programmed properly and is ignoring `SIGCHLD` signals, this won't help. You'll have to kill or close the zombies' parent process. When the process that created the zombies ends, `init` inherits the zombie processes and becomes their new parent. (`init` is the first process started on Linux at boot and is assigned PID `1`.) `init` periodically executes the `wait()` system call to clean up its zombie children, so `init` will make short work of the zombies. You can restart the parent process after closing it.

If a parent process continues to create zombies, it should be fixed so that it properly calls `wait()` to reap its zombie children.

A **zombie** process is not the same as an **orphan** process. An **orphan** process is a process that is still executing, but whose parent has died. They do not become zombie processes; instead, they are adopted by `init` (process ID `1`)

In other words, after a child's parent terminates, a call to `getppid()` will return the value `1`. This can be used as a way of determining if a child's true parent is still alive (this assumes a child that was created by a process other than `init`).

## Task 5 - Signals

When you type the interrupt character (`Ctrl`+`c`), the `ISGINT` signal will be sent to the foreground process (the program currently running). This will cause the program to terminate unless it has some arrangement for catching the signal.

The command `kill` can be used to send a signal to a process other than the current foreground process. To send a hangup signal to a shell running on a different terminal, you can use the following command:

```sh
$ kill -HUP pid_number
```

There is another useful variant of `kill` is `killall`. This allows us to send a signal to all processes running a specified command. For example, to send a reread signal to the `inetd` program:

```sh
$ killall -HUP inetd
```

The command causes the `inetd` program to reread its configuration options.

In the following example, the program will reacts to the `ctrl+c` rather than terminating foreground task. But if you hit the `ctrl+c` again, it will do what it usually does, terminating the program.

Create a new file called `signals.c`

```sh
nano signals.c
```

```c
#include <stdio.h>
#include <unistd.h>
#include <signal.h>

void my_signal_interrupt(int sig)
{
  printf("I got signal %d\n", sig);
  (void) signal(SIGINT, SIG_DFL);
}

int main()
{
  (void) signal(SIGINT,my_signal_interrupt);

  while(1) {
      printf("Waiting for interruption...\n");
      sleep(1);
  }
}
```

Compile and run:

```sh
gcc signals.c -o signals && ./signals
```

Remember to press `ctrl`+`c` to interact and do it a second time to close the program.

Output:

```sh
/signals
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
I got signal 2
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...
Waiting for interruption...

```

The `my_signal_interrupt()` is called when we give `SIGINT` signal by typing `ctrl+C`. After the interrupt function `my_signal_interrupt()` has completed, the program moves on, but the signal action is restored to the default. So, when it gets a second `SIGINT` signal, the program takes the default action, which is terminating the program.

## Signals Look up



|Signal	|Name|	Description|
|---|----|---|
|`SIGHUP`	   |1	| Hangup (POSIX)|
|`SIGINT`	   |2	| Terminal interrupt (ANSI)|
|`SIGQUIT`	 |3	| Terminal quit (POSIX)|
|`SIGILL`	   |4	| Illegal instruction (ANSI)|
|`SIGTRAP`	 |5	| Trace trap (POSIX)|
|`SIGIOT`	   |6	| IOT Trap (4.2 BSD)|
|`SIGBUS`	   |7	| BUS error (4.2 BSD)|
|`SIGFPE`	   |8	| Floating point exception (ANSI)|
|`SIGKILL`	 |9	| Kill(can't be caught or ignored) (POSIX)|
|`SIGUSR1`	 |10| 	User defined signal 1 (POSIX)|
|`SIGSEGV`	 |11| 	Invalid memory segment access (ANSI)|
|`SIGUSR2`	 |12| 	User defined signal 2 (POSIX)|
|`SIGPIPE`	 |13| 	Write on a pipe with no reader, Broken pipe (POSIX)|
|`SIGALRM`	 |14| 	Alarm clock (POSIX)|
|`SIGTERM`	 |15| 	Termination (ANSI)|
|`SIGSTKFLT` |16| 	Stack fault|
|`SIGCHLD`	 |17| 	Child process has stopped or exited, changed (POSIX)|
|`SIGCONT`	 |18| 	Continue executing, if stopped (POSIX)|
|`SIGSTOP`	 |19| 	Stop executing(can't be caught or ignored) (POSIX)|
|`SIGTSTP`	 |20| 	Terminal stop signal (POSIX)|
|`SIGTTIN` |21| 	Background process trying to read, from TTY (POSIX)|
|`SIGTTOU`	 |22| 	Background process trying to write, to TTY (POSIX)|
|`SIGURG`	   |23| 	Urgent condition on socket (4.2 BSD)|
|`SIGXCPU`	 |24| 	CPU limit exceeded (4.2 BSD)|
|`SIGXFSZ`	 |25| 	File size limit exceeded (4.2 BSD)|
|`SIGVTALRM` |26| 	Virtual alarm clock (4.2 BSD)|
|`SIGPROF`	 |27| 	Profiling alarm clock (4.2 BSD)|
|`SIGWINCH`	 |28| 	Window size change (4.3 BSD, Sun)|
|`SIGIO`	   |29| 	I/O now possible (4.2 BSD)|
|`SIGPWR`	   |30| 	Power failure restart (System V)|


