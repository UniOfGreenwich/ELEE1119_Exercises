# Learning C

We will be doing this lab inconjuction with the C lecture. Key concepts will be explained and you will put into practice.

So let's make our first program.

~~~admonish important

To do this you will need to open up a terminal and ensure your system has `gcc` installed.

- [https://gcc.gnu.org/gcc-13/](https://gcc.gnu.org/gcc-13/)


~~~

## 1. First C Program

1. Create a new directory and call it `ELEE1119/Learning_C` we can do this using the following commands in terminal. 

    ~~~admonish terminal

    ```
    $  mkdir -p ELEE1119/Learning_C
    ```

    ~~~

    ~~~admonish warning

    - the `$` symbol used in the above indicates that this is a command that should be entered into the terminal.
    - these are shell commands written in `c`. 

    ~~~

2. Now you are to navigate to this directory using the following command and create your first file:

    ~~~admonish terminal

    ```
    $  cd ELEE1119/Learning_C
    $  touch helloworld.c
    ```

    ~~~

    ~~~admonish note

    Each line should be entered in seperately 

    ~~~

3. If we use the command `ls` we can list the content of the directory and should see at a file named 'helloworld.c'

    ~~~admonish terminal

    ```
    $ ls
    ```

    ~~~

    ~~~admonish output

    ```
    helloworld.c
    ```

    ~~~

4. Now we are going to open up and edit the content of the file and write it out: 

    ~~~admonish terminal

    ```
    $ vim helloworld.c
    ```

    ~~~

5. Enter the following: 

    ~~~admonish code

    ```c
    #include <stdio.h> // we need this library to get access to the input and out put methods for printing to terminal

    int main()
    {
        printf("Hello World\n"); // lets say hello, where it all began...
        
        printf("Goodbye World\n"); // this seems fitting as the program will close after this.
        
        return 0; // returns 0 to the int of main() and terminate the program
    }
    ```

    ~~~

    ~~~admonish tip

    - To use `i` to enter **INSERT** mode

    - Escape key to current mode into **COMMAND** mode

    - `:wq` write and quit

    ~~~

    ~~~admonish example title='Explanation'

    Some explanation about the above code:

    - All code gets executed inside of `main()`, 

    - For the program to terminate the `main()` has to have a returnable value, `int`, 

    - The keyword at the end of the `main()` is `return`, this is will return the value preceeding it, 

    - A `0` execute means no errors. 

    - Similar to `C#` to use libraries `c` programs import with the `#include` keyword instead of `using`. 

    - The included library is the standard input out header, `stdio.h`.  

    - By including this header file we have access to the `printf()` function that enables us to return information to the terminal in string format.

    ~~~

6. Now we are going to compile the code so that we have an executable file that can be run from the terminal:

    ~~~admonish terminal

    ```
    $ gcc helloworld -o helloworld.exe
    ```

    ~~~

    ~~~admonish info


    - `gcc` is another shell command that is built in `c`, it's purpose is to compile `.c` files into executables using the the `gcc`.

    - Using the option `-o` we specifiy the output path/to/file

    - For more info -> [gcc](https://man7.org/linux/man-pages/man1/gcc.1.html)

    ~~~

7. Now let's see the fruits of our labour, the file can be executed as follows:

    ~~~admonish output

    ```
    $ ./helloworld.exe
    Hello World
    Goodbye World
    ```

    ~~~

    ~~~admonish success

    Congratulations, you used the programming language of the gods!

    ~~~

----

## 2. Input/Output functions

~~~admonish example title="Explanation"

In C programming, `printf()` is one of the main output function. The function sends formatted output to the screen. For example, the code below is a modified version of the helloworld programme we wrote a moment ago. 

~~~

1. Create a new file `vim inputoutput.c` and reproduce the code below:

    ~~~admonish code

    ```c
    #include <stdio.h>    
    int main()
    { 
        // Displays the string inside quotations
        printf("C Programming");
        return 0;
    }
    ```

    ~~~

    ~~~admonish tip

    Remeber to use the vim shortcuts from before to edit, write and quit.

    ~~~

2. Compile and run:

    ~~~admonish terminal

    ```
    $ gcc inputoutput.c -o inputoutput.anything
    $ ./inputoutput.anything
    C Programming
    ```

    ~~~

----------

### 2.2 Data Type: Printing Integer

3. Now we are going to modifiy the script again `$ vim inputoutput.c` to look like below:

    ~~~admonish code

    ```c
    #include <stdio.h>
    int main()
    {
        int testInteger = 5;
        printf("Number = %d", testInteger);
        return 0;
    }
    ```

    ~~~

    ~~~admonish example title="Explanation"

    We use `%d` format specifier to print `int` types. Here, the `%d` inside the quotations will be replaced by the value of `testInteger`.

    ~~~

    ~~~admonish tip

    Remeber to use the vim shortcuts from before to edit, write and quit.

    ~~~

4. Run the script again... 

    ~~~admonish terminal

    ```
    $ ./inputoutput.anything
    ```

    What happened? 

    ~~~

5. Well we need to recompile the code. 

    ~~~admonish output collapsible=true

    ```
    $ gcc inputoutput.c -o inputoutput.anything
    $ ./inputoutput.anything
    Number = 5

    ```

    ~~~


----

### 2.3 Data Types: Printing Float and Double

6. Open and modify the same file again to look like below:

    ~~~admonish code

    ```c
    #include <stdio.h>
    int main()
    {
        float number1 = 13.5;
        double number2 = 12.4;

        printf("number1 = %f\n", number1);
        printf("number2 = %lf", number2);
        return 0;
    }
    ```

    ~~~

    ~~~admonish example title="Explanation"
    
    To print float, we use `%f` format specifier. Similarly, we use `%lf` to print double values.

    ~~~

7. Compile the code again using format `gcc <filesource> -o <fileoutput>`...

8. Run it `./<fileoutput>`: 

    ~~~admonish output

    ```
    $ ./inputoutput.anything 
    number1 = 13.500000
    number2 = 12.400000
    ```
    ~~~

### 2.4 Data Types: Printing Characters

9. Open and modify the same file again to look like below:

    ~~~admonish code

    ```c
    #include <stdio.h>
    int main()
    {
        char chr = 'a';    
        printf("character = %c", chr);  
        return 0;
    } 
    ```
    ~~~

    ~~~admonish example title="Explanation"

    To print `char`, we use `%c` format specifier.

    ~~~

10. Remember to compile and then run:

    ~~~admonish output

    ```
    $ ./inputoutput.anything 
    character = a
    ```

    ~~~

### 2.5 User Input in C


~~~admonish tip

In C programming, `scanf()` is one of the commonly used function to take input from the user. The `scanf()` function reads formatted input from the standard input such as keyboards.

~~~

11. Again we will modify the program to look like the code below:

    ~~~admonish code

    ```c
    #include <stdio.h>
    int main()
    {
        int testInteger;
        printf("Enter an integer: ");
        scanf("%d", &testInteger);  
        printf("Number = %d",testInteger);
        return 0;
    }
    ```

    ~~~

    ~~~admonish example title="Explanation"

    Here, we have used `%d` format specifier inside the `scanf()` function to take `int` input from the user. When the user enters an integer, it is stored in the `testInteger` variable.

    Notice, that we have used `&testInteger` inside `scanf()`. It is because `&testInteger` gets the address of `testInteger`, and the value entered by the user is stored in that address. We will cover addressing and pointers at a later date.

    ~~~


12. Compile and run:

    ~~~admonish output

    ```
    $ ./inputoutput.anything
    Enter an integer: 4
    Number = 4
    ```

    ~~~



---

## 3. Format Specifiers

Here is a table of possible format specifiers for input and output:

|Data Type|	Format Specifier|
|---|---|
|`int`	|`%d`|
|`char`	|`%c`|
|`float`	|`%f`|
|`double`	|`%lf`|
|`short int`	|`%hd`|
|`unsigned int`	|`%u`|
|`long int`	|`%li`|
|`long long int`	|`%lli`|
|`unsigned long int`	|`%lu`|
|`unsigned long long int`	|`%llu`|
|`signed char`	|`%c`|
|`unsigned char`	|`%c`|
|`long double`	|`%Lf`|

---


## 4. Data Types

1. Create a new file with `vim` like this:

    ~~~admonish terminal

    ```
    $ vim dataTypeSize.c
    ```

    ~~~

2. We are going to write a program that returns the size of each data type availabe in `c`.

    ~~~admonish code

    ```c
    #include<stdio.h>
    int main(){

        printf("Data_Types\t\tStorage_Size \n");
        printf("char\t\t\t%d byte(s) \n", sizeof(char));
        printf("int\t\t\t%d byte(s) \n", sizeof(int));
        printf("double\t\t\t%d byte(s) \n", sizeof(double));
        printf("float\t\t\t%d byte(s) \n", sizeof(float));
        printf("unsigned char\t\t%ld byte(s) \n", sizeof(unsigned char));
        printf("long\t\t\t%d byte(s) \n", sizeof(long));
        printf("unsigned long\t\t%ld byte(s) \n", sizeof(unsigned long));
        printf("long double\t\t%ld byte(s) \n", sizeof(long double));

        return 0;
    }

    ```

    ~~~

    ~~~admonish terminal

    ```
    gcc dataTypeSize.c -o dataTypeSize
    ```

    ~~~

3. Now enter the following to see the data types and there available sizes in bytes: 

    ~~~admonish output

    ```
    $ ./dataTypeSize

    Data_Types              Storage_Size 
    char                    1 byte(s) 
    int                     4 byte(s) 
    double                  8 byte(s) 
    float                   4 byte(s) 
    unsigned char           1 byte(s) 
    long                    8 byte(s) 
    unsigned long           8 byte(s) 
    long double             16 byte(s) 
    ```

    ~~~