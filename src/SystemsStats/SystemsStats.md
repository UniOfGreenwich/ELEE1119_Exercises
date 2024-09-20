# Introduction

You will be developing and maintaining a series systemScripts, you need to start here. 

## Script creation

You first need to create a script that you can develop:

```sh
$ mkdir -p Documents/Scripts/bash/
$ cd Documents/Scripts/bash/
$ touch systemsStats.sh
```

- You have created a series of directories using `mkdir -p ...`
- changed current path to the newely created directories `cd ...`
- finally you create a file with `touch` in the `../bash/` directory.

## Basics

Bash is an interpreter and will execute each line one at a time, so in order to do that we need to specify that the script we are writing is designed for that. 

Open the newly created file with the `vim` text editor

```sh
$ vim systemStats.sh
```

- press the lowercase `i` to enter **INSERT** mode...

Reproduce the following:

```sh

#! /usr/bin/env cat

echo Hello World, Goodbye World!
```

- press the **ESC** key to exit **INSERT** mode..
- press the shift and the colon key to enter **COMMAND** mode
- press `w` and `q` so the bottom of the `vim` looks like `:wq` and press the return key to write `w` and quit `q`.

Run the script:

```sh
$ bash systemStats.sh
> Hello world, Goodbye World!
```

- `bash` command executes the content of the script as bash script regardless of the shebang `#! /usr/bin/env bash` this is correct behaviour as the bash runs the first line of code... `echo ...`
  
Lets change the file modifiers so that the `systemStat.sh` is now an executable.

```sh
$ ls -lah
> drwxr-xr-x dev users 4.0 KB Tue Oct 10 19:13:49 2023  .
> drwx------ dev users 4.0 KB Tue Oct 10 12:40:13 2023  ..
> .rw-r--r-- dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
```
>**Note**
>> - `d` stands for directory
>> - modifiers are broken down into 3 octet sets,
>>      - user group rest-of-the-world
>>      - rwx r-x r-x
>>      - `r` = read, `w` = write, `x` = execute

Running the following to change permissions for this:

```sh
...
> .rw-r--r-- dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
$ chmod +x systemStats.sh
$ ls -lah 
> ...
> ...
> .rwxr-xr-x dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
```

Now that the file is an exectuable we can call it like this:

```sh
$ ./systemStats.sh
>#! /usr/bin/env cat
>
>echo Hello World, Goodbye World!
```

This is because the file is an executable and the shebang runs the script with the program at the end of the line i.e `cat`

As proof lets use cat directly:

```sh
$ cat systemStats.sh
>#! /usr/bin/env cat
>
>echo Hello World, Goodbye World!
```

Changing the shebang to `bash` will ensure the `bash` program is called instead. 

```sh
$ vim ./systemStats.sh
```

Again remember to press `i` to enter **INSERT** mode, and reproduce the following

```sh
#! /usr/bin/env bash

echo Hello World, Goodbye World!
```

Run the program and you will get the same output as `bash systemStats.sh`

```sh
$ ./systemStats.sh
> Hello World, Goodbye World!
```

## A more meaningful script

Scripting is useful for automating process and system admin. For example, getting lots of information from all over the OS using one script.

```sh
$ cat /etc/hostname
> Rock-c4-plus
```
Lets add that to our script:

```sh
$ vim systemStats.sh
```

Reproduce the following:

```sh
#! /usr/bin/env bash

# echo Hello World, Goodbye World!
hostname
```
Remember to change to **INSERT** mode and write and quit.

Running this will look like: 

```sh
$ ./systemStats.sh
Rock-c4-plus
```
This is because we have commented out the `echo ...` witht the `#` hash symbol.

Running `cat /etc/os-release` will give you the following:

```sh
$ cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

What we need to isolate is the OS's name, which is identifiable via the `NAME=...`. To do this will use two exta packages, `grep` and `awk` to get what we need.

```sh
$ cat /etc/os-release | grep -w NAME | awk -F '=' '{print $2}'
"Debian GNU/Linux"
```
Here we are piping, `|`, the output of `cat ...` into the command `grep` with option `-w`. This option `-w` means "*select only those lines containing matches that form whole word.*". So we are searching for `NAME`.

Next we pipe the result of that search, `NAME="Debian GNU/Linux"` into `awk` to grab only `Debian GNU/Linux` where we split the result based on a delimeter, `=`, with the option `-F` (Field delimeter). The delimited format is:

![](./step1.svg)

However we want the string between the `"`, so we modify the command to take more than one delimitter, order matters:


```sh
$ cat /etc/os-release | grep -w NAME | awk -F '[="]' '{print $3}'
Debian GNU/Linux
```

Note the addition of `[="]` and `$3`:

![](./step2.svg)

- Field 1 (`$1`): NAME
- Field 2 (`$2`): (empty string, as there is nothing between `=` and `"`)
- Field 3 (`$3`): Debian GNU/Linux

Now that we have isolated `Debian GNU/Linux`, we can add this functionality to our script, after the line `cat /etc/hostname`:

```sh
#! /usr/bin/env bash

# echo Hello World, Goodbye World!

cat /etc/hostname
cat /etc/os-release | grep -w NAME | awk -F '[="]' '{print $3}'
```

If you run this program now you should get the following output:

```sh
$ ./systemsStat.sh
Rock-c4-plus
Debian GNU/Linux
```
Now we want the OS version from the `VERSION="11 (bullseye)"` output of `cat /etc/os-release`, using what you have learned above try to isolate `bullseye`.

<details>
<summary>Suggested Solution</summary>

```sh
cat /etc/os-release | grep -w NAME | awk -F '[="()]' '{print $4}'
```

- The first field, `$1`, is everything before the equal sign (`=`), which is VERSION.

- The second field, `$2`, is everything between the equal sign (`=`) and the double quote (`"`), which is `11`.

- The third field, `$3`, is everything between the double quote (`"`) and the opening parenthesis (`(`), which is a space character.

- The fourth field, `$4`, is everything between the opening parenthesis (`(`) and the closing parenthesis (`)`), which is `bullseye`.

    ![](./step3.svg)

</details>


Once completed add the code to the script like before, run to verify the expected output:

```sh 
$ ./systemsStats.sh
Rock-c4-plus
Debian GNU/Linux
bullseye
```

If you have completed the above the well done. 
