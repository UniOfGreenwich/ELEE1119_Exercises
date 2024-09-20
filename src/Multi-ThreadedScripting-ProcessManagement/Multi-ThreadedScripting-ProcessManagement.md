# Multi-Threaded Scripting & Process Management

The things you can do using Bash script are limitless. Once you begin to developed advanced scripts, you’ll soon find you will start to run into operating system limits.

For example, does your computer have 2 CPU threads or more (many modern machines have 8-32 threads)? If so, then you will likely benefit from multi-threaded Bash scripting and coding. Continue reading and find out why

>**In this Turorial you will learn:**
>> - How to implement multi-threaded Bash one-liners directly from the command line
>>
>> - Why multi-threaded coding almost always can and will increase the performance of your scripts
>>
>> - How background and foreground processes work and how to manipulate job queues

Some information related to the format of this lab:

>**Important**
>> - Use a linux CLI.

>> **Naming Conventions**
>> -  `#` - requires given linux commands to be executed with root privileges either directly as root user of by use of `sudo` command
>>
>> -  `$` - requires given linux commands to be executed as a regular non-privileged user

-----------

When you execute a Bash script, it will at maximum use a **single CPU thread**, unless you start **subshells/threads**. If your machine has at least two CPU threads, you will be able to max-out CPU resources using multi-threaded scripting in Bash.

The reason for this is simple; as soon as a secondary ‘thread’ is started, then that subsequent thread can (and often will) use a different CPU thread.

Assume for a moment that you have a modern machine with 8 or more threads. Can you start seeing how if you would be able to execute code – eight parallel threads all at the same time, each running on a different CPU thread (or shared across all threads) – this way it would execute much faster then a single-threaded process running on a single CPU thread (which may be co-shared with other running processes)? The gains realised will depend a bit on what is being executed, but gains there will be, almost always!



First you need to understand what a **subshell** is, how it is started, why you would use one, and how it can be used to implement multi-threaded Bash code.

A **subshell** is another Bash client process executed/started from within the current one. Let’s do something easy, and start one from within an opened Bash terminal prompt and type the following commands:

```sh
$ bash
$ exit
```
your output should be:

```
exit
$
```

<details>
<summary>What happened here?</summary>

1. You started another Bash shell (bash) which started and in turn yielded a command prompt (`$`). 
2. So the second `$` in the example above is actually a different Bash shell, with a different **PID** 
   - (**PID** is the process identifier; a unique number identifier which uniquely identifies each running process in an operating system).
3.  Finally you exited from the subshell via exit and returned to the parent subshell! 

</details>

Run again but this time append `echo` with `$$` you will see proof of this, your PIDs may differ.

```sh
$ echo $$
220250
```
```sh
$ bash
$ echo $$
222629
```
```sh
$ exit
exit
```
```
$ echo $$
220250
```

There is a special variable in bash `$$`, which contains the **PID** of the current shell in use. 

Can you see how the process identifier changed once you were inside a subshell?

If yes, then you have an idea of a what a subshell is.

-----

## Simple mulit-threading in Bash

Lets start with a simple one-liner multi-threaded example, of which the output may look somewhat confusing at first:

```sh
$ for i in $(seq 1 2); do echo $i; done
```

Output:
```sh
1
2
```

Do it again but append the `echo $i` with `&`:

```sh
$ for i in $(seq 1 2); do echo $i & done
```

Output:
```sh
[1] 223561
1
[2] 223562
$ 2
[1]-  Done                    echo $i
[2]+  Done                    echo $i
$
```

In the first for loop , you simply output the variable `$i` which will range from 1 to 2 (due to our use of the `seq` command), which – interestingly – is started in a **subshell**!

>**Note:**
>>
>> You can use the `$(...)` syntax anywhere within a command line to start a subshell: it is a very poyourful and versatile way to code subshells directly into other command lines!

In the second for loop, you have changed only one character. Instead of using `;` – an **EOL** (end of line) Bash syntax idiom which terminates a given command (you may think about it like Enter/Execute/Go ahead), you used `&`.

This simple change makes for an almost completely different program, and your code is now **multi-threaded**! Both `echo`’s will process more or less at the same time, with a small delay in the operating system still having to execute the second loop run (to `echo` ‘2’).

You can think about `&` in a similar way to `;` with the difference that `&` will tell the operating system to ‘keep running the next command, keep processing the code’ whereas `;` will wait for the current executing command (terminated by `;`) to terminate/finish before returning to the command prompt `/` before continuing to process and execute the next code.

Let’s now examine the output. You see:

```sh
[1] 223561
1
[2] 223562
$ 2
```

At first, followed by:

```sh
[1]-  Done                    echo $i
[2]+  Done                    echo $i
$
```

And there is also an empty line in between, which is the result of **background processes** still running whilst waiting for the next command input (try this command a few times at the command line, as you'll as some light variations, and you will get a feel how this works).

The first output `[1] 223561` shows you that a background process was started, with `PID 223561` and the identifier number `1` was given to it. Then, already before the script reached the second `echo` (an `echo` likely being an expensive code statement to run), the output `1` was shown.

Your background process did not finish completely as the next output indicates you started a second subshell/thread (as indicated by `[2]`) with `PID 223562`. Subsequently the second process outputs the `2` (*indicatively*: OS mechanisms may affect this) before the second thread finalises.

Finally, in the second block of output, you see the two processes terminating (as indicated by `Done`), as well as what they were executing last (as indicated by `echo $i`). Note that the same numbers `1` and `2 `are used to indicate the background processes.

## More multi-threading in Bash

Next, let’s execute three `sleep` commands, all terminated by `&` (so they start as background processes), and let us vary their `sleep` duration lengths, so you can more clearly see how background processing works:

```sh
$ sleep 10 & sleep 1 & sleep 5 &
```
Ouput:
```
[1] 7129
[2] 7130
[3] 7131
$
[2]-  Done                    sleep 1
$
[3]+  Done                    sleep 5
$
[1]+  Done                    sleep 10
```

The output in this case should be self-explanatory. The command line immediately returns after your `sleep 10 & sleep 1 & sleep 5 &` command, and **3 background processes**, with their respective PID’s are shown. 

You can hit enter a few times in between.

After 1 second the first command completed yielding the `Done` for process identifier `[2]`. Subsequently the third and first process terminated, according to their respective `sleep` durations. Also note that this example show clearly that multiple jobs are effectively running, simultaneously, in the background.

You may have also picked up the `+` sign in the output examples above. This is all about **job control**. You will look at job control in the next example, but for the moment it’s important to understand that `+` indicates is the job which will be controlled if you were to use/execute job control commands. It is always the job which was added to the list of running jobs most recently. This is the default job, which is always the one most recently added to the list of jobs.

A `-` indicates the job which would become the next default for job control commands if the current job (the job with the `+` sign) would terminate. Job control (or in other words; **background thread handling**) may sound a bit daunting at first, but it is actually very handy and easy to use once you get used to it.

## Job Control in Bash

Run the following command in the CLI:

```sh
$ sleep 20 & sleep 15 &
```

You should have an output similar to below:

```sh
[1] 7468
[2] 7469
```

Immedeately type: 

```sh
$ jobs
```
... and you will see the following: 
```sh
[1]-  Running                 sleep 20 &
[2]+  Running                 sleep 15 &
```
Now enter:

```sh
$ fg 2
```
... and you'll see:

```sh
sleep 20
```
Once job 2 has finshed type: 

```sh
$ fg 1
```
... and you'll see:

```
sleep 15
```

Here you placed two `sleeps` in the **background**. Once they were started, you examined the currently running jobs by using the `jobs` command. Next, the **second thread** was placed into the foreground by using the `fg` command followed by the job number. You can think about it like this; the `&` in the `sleep 15` command was turned into a `;`. In other words, a background process (not waited upon) became a foreground process.

You then waited for the `sleep 15` command to finalise and subsequently placed the `sleep 20` command into the foreground. Note that each time you did this you had to wait for the foreground process to finish before you would receive your command line back, which is not the case when using only background processes (as they are literally ‘running in the background’).

## Job Control in Bash: Job Interruption


Type the following into the CLI:

```sh
$ sleep 20
```

Once you have pressed the return key, press `ctrl`+`z` and you'll see:
```sh
^Z
[1]+  Stopped                 sleep 20
```
Next type: 
```sh
$ bg 1
```
... and you will see:
```sh
[1]+ sleep 20 &
```
Now type:
```
$ fg 1
```
... and let the sleep function complete:
```
sleep 20
```

Here you press `ctrl`+`z` to interrupt a running `sleep 20` (which **stops** as indicated by `Stopped`). You then place the process into the background and finally placed it into the foreground and wait for it to finish.

Now type:

```sh
$ sleep 100
^Z
```
and you'll see the familiar output:
```sh
[1]+  Stopped                 sleep 100
```

Now type the command:
```sh
$ kill %1
```
... and you will see:
```sh
[1]+  Terminated              sleep 100
```
Having started a 100 second `sleep`, you next interrupt the running process by `ctrl`+`z`, and then kill the first started/running background process by using the `kill` command. 

>**Note:** 
>> - Did you notice the use of `%1` in this case, instead of simply `1`?
>> - This is because you are now working with a **utility**(`kill`) which is not natively tied to background processes, like `fg` and `bg` are. 
>> - To indicate to `kill` that you want to effect the first background process, you use `%` followed by the background process number.

## Job Control in Bash: Process Disown

Now type:

```sh
$ sleep 100
^Z
```
and you'll see the familiar output:
```sh
[1]+  Stopped                 sleep 100
```

Now type the command:
```sh
$ bg %1
```
... and you will see:
```sh
[1]+  sleep 100 &
```

Finally type:

```sh
disown
```

In this final example, you again terminate a running `sleep`, and place it into the **background**. Finally you execute the `disown` command which you can read as: disassociate all background processes (jobs) from the current shell. They will keep running, but are no longer *owned* by the **current shell**. Even if you close your current shell and logout, these processes will keep running until they naturally terminate. 

This is a very powerful way to interrupt a process, place it into the background, `disown` it and then logout from the machine you were using, provided you will not need to interact with the process anymore. 

Ideal for those long running processes over `SSH` which cannot be interrupted. Simply `ctrl`+`z` the process (which temporarily interrupts it), place it into the background, `disown` all jobs, and logout! Go home and have a nice relaxed evening knowing your job will keep running!

## More process mangement and Disowing

Type the following: 

```sh
$ sleep 1000 &
```

Output:

```
[1] 25867
```

Then type:

```sh
fg 
sleep 1000
```
Here you started a 1000 second `sleep` process in the background. If you want to put a process in the background, remember you can use the ampersand (`&`) sign behind any command. This will place the process in the background, and reports back the `PID` In this example, the `PID` is `25867`. 

You next place the process back in the foreground (as if there never was a background instruction) by using the `fg` (i.e. foreground) command. The result is that you see what process is being placed in the foreground again (i.e. `sleep 1000`) and your command prompt does not return as you placed the `sleep` back in the foreground and the command prompt will only return when the 1000 second sleep is done.

Let’s say that you placed the `sleep 1000` in the background, did other work for 500 seconds, and then executed `fg`… 


<details>
<summary>How long would the sleep still run?</summary>

- 500 seconds
- The first 500 seconds were spent running as a background process, and the second 500 will be as a foreground process.

</details>

>**Note:**
>> If you terminate the shell your command will terminate – whether it is running in the background, or in the foreground (unless you disowned it, more on this in the next example).


## Disowning a Process: In-depth

With `sleep 1000` running press `ctrl`+`z` followed by the command `jobs` to see it has `Stopped`. Now enter `bg` followed by `jobs` to see it is `Running` again.

You are now going to `disown` the process like you did earlier:

```sh
$ disown %1
```

You may see, don't worry:
```sh
bash: warning: deleting stopped job 1 with process group 33277
```

As mentioned before, you can happily and safely walk away from your computer (after locking it ;), as you can rest assured that – even if your `SSH` connection fails, or your computer hibernates – that your job will remain running. As the process was disowned/disassociated from the current shell session, it will continue running even if the current shell session is somehow terminated.

One small caveat is that you cannot use `fg` in the morning to bring the job back to the foreground, even if your `SSH` connection and shell never terminated/failed:

```sh
$ fg 
bash: fg: current: no such job
$ fg %1
bash: fg: %1: no such job
```

When it’s disowned, it’s disassociated and gone! The job will still be running in the background though, and you can even kill it using it’s `PID` (as can be observed from `ps -ef | grep your_process_name | grep -v grep`:

```sh
ps -ef | grep sleep | grep -v grep
```
Output:

```sh
seb        33277    8194  0 12:38 pts/2    00:00:00 sleep 1000
```

`ps` displays information about a selection of the active processes, using `-e` select all processes, `f` gives full-format to the listing of processes. The `ps -ef` is piped `|`, the process of taking the standard ouput of a command into the next, into `grep`. 

`grep` searches for patterns.  Patterns is one or more patterns separated by newline (`\n`) characters, and `grep` prints each line that matches a pattern.  So the `grep sleep` is searching for the pattern `sleep` returned by the `ps -ef`, once found, the output of `grep sleep` is piped `|` into `grep` again where `-v` means to invert the sense of matching, to select non-matching lines. So you are searching for the inverse of `grep`. The output would return the following with out ... `| grep -v grep`.
```sh
$ ps -ef | grep sleep
seb      33277    8194  0 12:52 pts/0    00:00:00 sleep 1000
seb      33288    8194  0 12:52 pts/0    00:00:00 grep sleep
```

Notice that `grep` command returns it's self too.

So how do we terminate this process?

Type the following,

```sh
pkill -9 sleep
```

`pkill` is as variant of `kill`, where `kill` takes a PID, `pkill` takes the name of a process. Now that can be danagerous if you have more than 1 of the same process  running as it terminates any process name matching the command.

The `-9` means you're not telling the application to terminate itself, instead you're telling the OS to stop running the program, no matter what the program is doing.

Use `pkill -9` and `kill -9` responsibly, it could corrupt files as they are being written too. 