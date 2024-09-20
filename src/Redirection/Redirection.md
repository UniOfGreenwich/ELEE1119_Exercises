# Redirection

In this lab, we will review redirection operators encountered during bash scripting and their specific meaning.

---------------------

## 1. What is a File descriptor?

When you open a file in Linux, each file will be assigned with an Integer and this information is stored in the kernel. This way the kernel knows what files are opened and which process has opened the files. The assigned Integer number is what we call file descriptor (shortly FD).

By default, every program will start with three file descriptors.

- FD 0 -> Standard Input(stdin) -> Keyboard
- FD 1 -> Standard Output(Stdout) -> Display(Terminal)
- FD 2 -> Standard Error(Stderr) -> Display(Terminal)

You can see the file descriptors in `/dev` directory:

- Type the following:
  ```sh
  $ ls -l /dev/std*
  ```

- Ouput:
  ```sh
  lrwxrwxrwx 1 root root 15 Mar  5 20:19 /dev/stderr -> /proc/self/fd/2
  lrwxrwxrwx 1 root root 15 Mar  5 20:19 /dev/stdin -> /proc/self/fd/0
  lrwxrwxrwx 1 root root 15 Mar  5 20:19 /dev/stdout -> /proc/self/fd/1
  ```

Stdin (FD0) gets input from the keyboard. stdout (FD1) and stderr (FD2) are sent to the terminal. When using Pipes and Redirections, you can change the way where input is passed from and output and errors are sent to.

> The `proc` filesystem is a pseudo-filesystem which provides an
> interface to kernel data structures.  It is commonly mounted at `/proc.`

------------------------

## 2. Redirecting output to a file

As stated earlier, output (`stdout`) and error (`stderr`) of any program is sent to the terminal. You can use the redirection operator `>` to write the `stdout` and `stderr` to a file.

Take a look at the below example. I am running the `uname -mrs` command and redirecting the output to a file named `uname.log`.

Type the following:

```sh
$ uname -mrs > uname.log
```

Then type:
```sh
$ cat uname.log
Linux 5.10.0-8-amd64 x86_64
```

And then empty the file by using the `echo` command with no arguments or flags  and `>`:

```sh
echo > uname.log
```

> **Heads Up:** When using `>` operator, if the file is not available, it will be created. And if the file exists already, it will be overridden with new contents.

You can also use the file descriptor number for stdout(1) before the redirection operator to redirect output to a file.

Try this too: 

```sh
$ uname -mrs 1> uname.log
```

> A single redirection operator (`>`) will only override the contents of a file, if the file already exists. However, if you want to append the contents instead of overwriting to the same file, use double redirection operator (i.e. `>>`). You can also use stdout file descriptor(1) here too.


Next type:

```sh
$ whoami >> uname.log
```

and: 

```sh
$ echo $SHELL 1>> uname.log
```

Finally:

```sh
$ cat uname.log
```

**Output:**
```sh
Linux 5.4.0-1091-azure x86_64
jovyan
/bin/bash
```
-----------------------

## 3. How to handle Stderr

Every program generates both output and error and both are sent to the terminal. In many cases, you may wish to either ignore the error or isolate the errors and redirect it to a separate file for troubleshooting.

Let's take a simple example of running the `ls` command to see how this works.Say you are trying to list two files out of which only one is present. 

Target:

```sh
$ ls -l uname.log u1.log
```
and you will see:

```sh
ls: cannot access 'u1.log': No such file or directory
-rw-r--r-- 1 jovyan users 1 Mar  6 14:30 uname.log
```

Here you are getting both error and output in the terminal.

Now you will use the same `ls` command again but this time redirecting the output to a file. 

```sh
$ ls -l uname.log u1.log > ls.op
ls: cannot access 'u1.log': No such file or directory
```

As you can see from the output `>` operator redirects stdout(1) to a file but stderr(2) is sent to the terminal.

To redirect stderr to a file use the `2>` operator. It is mandatory to use the file descriptor for stderr(2) before the redirection operator `>` that will send the error alone to a file.

```sh
ls -l uname.log u1.log > ls.op 2> ls.err
```

Run the following command to see the contents of `ls.op` and `ls.err`

```sh
$ cat < ls.err
ls: cannot access 'u1.log': No such file or directory
```

Now, stdout and stderr are written to separate files. You can also send stdout and stderr to a single file too.

```sh
ls -l uname.log u1.log 1> ls.op 2> ls.op
```

From **bash 4.4**, you can also use &> sign to redirect both stdout and stderr to a file.
 
----------------------

## 4. What is /dev/null?

Null is a character special file that accepts input and discards the input and produces no output. To put this simply, null discards whatever you redirect to it.

Try:

```sh
$ ls -l /dev/null
```

Output:

```sh
crw-rw-rw- 1 root root 1, 3 Mar  5 20:19 /dev/null
```

Why does the null matter in redirection? You might wonder. In some cases, you may wish not to print or store stdout or stderr. In that case, you can redirect either stdout or stderr to `/dev/null` which will discard the stream of input.

> 
>>`c` character device based file Within Linux devices such as hardware are characterised in two ways:
>>Character Devices (`c`) which are devices which transfer data in characters also known as bytes or bits such as mice, speaker etc.
>>
>> The file type is one of the following characters:
>> ?-   `-`  regular file
>> -   `b`  block special file
>> -   `c`  character special file
>> -   `C`  high performance ("contiguous data") file
>> -   `d`  directory
>> -   `D`  door (Solaris 2.5 and up)
>> -   `l`  symbolic link
>> -   `M`  off-line ("migrated") file (Cray DMF)
>> -   `n`  network special file (HP-UX)
>> -   `p`  FIFO (named pipe)
>> -   `P`  port (Solaris 10 and up)
>> -   `s`  socket
>> -   `?`  some other file type

Try the following commands:

- Stdout and Stderr to Null
    ```sh
    $ date > /dev/null
    ```

-  Stdout to Null
    ```sh
    $ date 1> /dev/null    
    ```

-  WRONG COMMAND, Stderr to Null

    ```sh
    $ dateee 2> /dev/null 
    ```
- Stdout/Stderr to Null
    ```sh
    $ date &> /dev/null    
    ```

-------------

## 5. Input Redirection in Bash

Similar to how you are redirecting the output and error to a file, you can also pass inputs to a command using input redirection operator (`<`).

Let’s start with a simple word count program:

```sh
$ wc -l < uname.log
```

Here, you are redirecting the contents of `uname.log` file to the word count to find the number of lines.

**Output:**

```sh
1
```

You can also pass stdin file descriptor (0) when redirecting the input.

Try this:

```sh
$ wc -l 0< uname.log
1
```

You can combine the input and output redirection operators as shown below.

```sh
wc -l < uname.log &> wc.op
```

**Output:**

```sh
$ cat wc.op 
1
```

Input redirection will be used along with a while loop to read the content of a file line by line.


-----

## 6. Input redirection will be used along with a while loop to read the content of a file line by line.

Take a look at the below example. I am passing the `/etc/passwd` file as the input to the while command. Here the read command will read line by line and store it in the variable `VAL` and further down in the loop condition is written to check if the user is available.

Create a bash script called `alertUser.sh`

```sh
nano alertUser.sh
```

and fill with the following code:

```sh
#! /usr/bin/env bash
while read VAL; do   
  NAME=$(echo $VAL | awk -F  ":" '/1/ {print $1}' )
  if [[ $NAME -eq $(cat < uname.log | awk 'NR==2') ]];then
   echo "User spotted"
   break
  fi
done < /etc/passwd
```

If you have followed this lab exactly,  `$(cat < uname.log | awk 'NR==2')` should contain your system username.

This is not an optimal way to achieve the task of finding the user but for demonstration purposes, this will do.

Now, make the script executable and run it:

```sh
$ chmod +x alertUser.sh
```

**Ouput:**
```sh
$ bash alertUser.sh
User spotted
```

>**Exploration**
>> run these commands from the script seperatley to explore what is going on
>> - `cat /etc/passwd`
>> - `cat /etc/passwd | awk -F  ":" '/1/ {print $1}'`
>> - `cat < uname.log | awl 'NR==2')`