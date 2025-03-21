# Introduction

You will be developing and maintaining a series systemScripts, you need to start here. 

## 1. Script creation

1. You first need to create a script that you can develop:

~~~admonish code

```sh
$ mkdir -p Documents/Scripts/bash/
$ cd Documents/Scripts/bash/
$ touch systemsStats.sh
```

~~~

~~~admonish example title="Explanation"

- You have created a series of directories using `mkdir -p ...`
- changed current path to the newely created directories `cd ...`
- finally you create a file with `touch` in the `../bash/` directory.

~~~

## 2. Basics

Bash is an interpreter and will execute each line one at a time, so in order to do that we need to specify that the script we are writing is designed for that. 

2. Open the newly created file with the `vim` text editor

    ~~~admonish termnial

    ```sh
    $ vim systemStats.sh
    ```

    ~~~

    ~~~admonish tip

    press the lowercase `i` to enter **INSERT** mode...

    ~~~

3. Reproduce the following:

    ~~~admonish code

    ```sh
    #! /usr/bin/env cat

    echo Hello World, Goodbye World!
    ```
    ~~~

    ~~~admonish tip
    
    - press the **ESC** key to exit **INSERT** mode..
    - press the shift and the colon key to enter **COMMAND** mode
    - press `w` and `q` so the bottom of the `vim` looks like `:wq` and press the return key to write `w` and quit `q`.

    ~~~

4. Run the script:

    ~~~admonish output

    ```sh
    $ bash systemStats.sh
    > Hello world, Goodbye World!
    ```

    ~~~

    ~~~admonish example title="Explanation"

    - `bash` command executes the content of the script as bash script regardless of the shebang `#! /usr/bin/env bash` this is correct behaviour as the bash runs the first line of code... `echo ...`

    ~~~
  
5. Lets change the file modifiers so that the `systemStat.sh` is now an executable.

    ~~~admonish output

    ```sh
    $ ls -lah
    > drwxr-xr-x dev users 4.0 KB Tue Oct 10 19:13:49 2023  .
    > drwx------ dev users 4.0 KB Tue Oct 10 12:40:13 2023  ..
    > .rw-r--r-- dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
    ```

    ~~~

    ~~~admonish example title="Explanation"

    - `d` stands for directory
    - modifiers are broken down into 3 octet sets,
        - user group rest-of-the-world
        - rwx r-x r-x
        - `r` = read, `w` = write, `x` = execute

    ~~~

6. Running the following to change permissions for this:

    ~~~admonish terminal

    ```sh
    ...
    > .rw-r--r-- dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
    $ chmod +x systemStats.sh
    $ ls -lah 
    > ...
    > ...
    > .rwxr-xr-x dev users   0 B  Tue Oct 10 19:13:49 2023  systemStats.sh
    ```

    ~~~

7. Now that the file is an exectuable we can call it like this:

    ~~~admonish output

    ```sh
    $ ./systemStats.sh
    >#! /usr/bin/env cat
    >
    >echo Hello World, Goodbye World!
    ```

    ~~~

    ~~~admonish example title="Explanation"

    This is because the file is an executable and the shebang runs the script with the program at the end of the line i.e `cat`

    ~~~

8. As proof lets use `cat` directly:

    ~~~admonish output

    ```sh
    $ cat systemStats.sh
    >#! /usr/bin/env cat
    >
    >echo Hello World, Goodbye World!
    ```

    ~~~

9. Changing the shebang to `bash` will ensure the `bash` program is called instead. 

    ~~~admonish terminal

    ```sh
    $ vim ./systemStats.sh
    ```

    ~~~

10. Again remember to press `i` to enter **INSERT** mode, and reproduce the following

    ~~~admonish code

    ```sh
    #! /usr/bin/env bash

    echo Hello World, Goodbye World!
    ```

    ~~~

11. Run the program and you will get the same output as `bash systemStats.sh`

    ~~~admonish output

    ```sh
    $ ./systemStats.sh
    > Hello World, Goodbye World!
    ```

    ~~~

## 3. A more meaningful script

12. Scripting is useful for automating process and system admin. For example, getting lots of information from all over the OS using one script.

    ~~~admonish output

    ```sh
    $ cat /etc/hostname
    > Rock-c4-plus
    ```

    ~~~

13. Lets add that to our script:

    ~~~admonish terminal

        ```sh
        $ vim systemStats.sh
        ```

    ~~~

14. Reproduce the following:

    ~~~admonish code

    ```sh
    #! /usr/bin/env bash

    # echo Hello World, Goodbye World!
    hostname
    ```
    ~~~


15. Running this will look like: 

    ~~~admonish output

    ```sh
    $ ./systemStats.sh
    Rock-c4-plus
    ```

    ~~~

    ~~~admonish example title="Explanation"

    This is because we have commented out the `echo ...` witht the `#` hash symbol.

    ~~~

16. Running `cat /etc/os-release` will give you the following:

    ~~~admonish output

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

    ~~~

17. What we need to isolate is the OS's name, which is identifiable via the `NAME=...`. To do this will use two exta packages, `grep` and `awk` to get what we need.

    ~~~admonish output

    ```sh
    $ cat /etc/os-release | grep -w NAME | awk -F '=' '{print $2}'
    "Debian GNU/Linux"
    ```

    ~~~

    ~~~admonish example title="Explanation"
    
    - Here we are piping, `|`, the output of `cat ...` into the command `grep` with option `-w`. 
    - This option `-w` means "*select only those lines containing matches that form whole word.*". 
    - So we are searching for `NAME`.

    ~~~


18. Next we pipe the result of that search, `NAME="Debian GNU/Linux"` into `awk` to grab only `Debian GNU/Linux` where we split the result based on a delimeter, `=`, with the option `-F` (Field delimeter). The delimited format is:

    ![](./step1.svg)

19. However we want the string between the `"`, so we modify the command to take more than one delimitter, order matters:

    ~~~admonish output

    ```sh
    $ cat /etc/os-release | grep -w NAME | awk -F '[="]' '{print $3}'
    Debian GNU/Linux
    ```

    ~~~

    ~~~admonish note
    
    Note the addition of `[="]` and `$3`:

    ~~~

    ![](./step2.svg)

    ~~~admonish example title="Explanation"

    - Field 1 (`$1`): NAME
    - Field 2 (`$2`): (empty string, as there is nothing between `=` and `"`)
    - Field 3 (`$3`): Debian GNU/Linux

    ~~~

20. Now that we have isolated `Debian GNU/Linux`, we can add this functionality to our script, after the line `cat /etc/hostname`:

    ~~~admonish code

    ```sh
    #! /usr/bin/env bash

    # echo Hello World, Goodbye World!

    cat /etc/hostname
    cat /etc/os-release | grep -w NAME | awk -F '[="]' '{print $3}'
    ```

    ~~~

21. If you run this program now you should get the following output:

    ~~~admonish output

    ```sh
    $ ./systemsStat.sh
    Rock-c4-plus
    Debian GNU/Linux
    ```

    ~~~

22. Now we want the OS version from the `VERSION="11 (bullseye)"` output of `cat /etc/os-release`, using what you have learned above try to isolate `bullseye`.

    ~~~admonish terminal collapsible=true 

    ```sh
    cat /etc/os-release | grep -w NAME | awk -F '[="()]' '{print $4}'
    ```

    ~~~

    ~~~admonish example title="Explanation" collapsible=true 
    
    - The first field, `$1`, is everything before the equal sign (`=`), which is VERSION.

    - The second field, `$2`, is everything between the equal sign (`=`) and the double quote (`"`), which is `11`.

    - The third field, `$3`, is everything between the double quote (`"`) and the opening parenthesis (`(`), which is a space character.

    - The fourth field, `$4`, is everything between the opening parenthesis (`(`) and the closing parenthesis (`)`), which is `bullseye`.

    ![](./step3.svg)

    ~~~

23. Once completed add the code to the script like before, run to verify the expected output:

    ~~~admonish output

    ```sh 
    $ ./systemsStats.sh
    Rock-c4-plus
    Debian GNU/Linux
    bullseye
    ```
    ~~~

    ~~~admonish success
    
    If you have completed the above the well done. 

    ~~~
