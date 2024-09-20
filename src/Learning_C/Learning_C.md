# Learning C

We will be doing this lab inconjuction with the C lecture. Key concepts will be explained and you will put into practice.

So let's make our first program.

To do this you will need to open up a terminal and ensure your system has `gcc` installed.

>> [https://gcc.gnu.org/gcc-13/](https://gcc.gnu.org/gcc-13/)

Create a new directory and call it `ELEE1119/Learning_C` we can do this using the following commands in terminal. 

```
$  mkdir -p ELEE1119/Learning_C
```
> **Note:**
>> - the `$` symbol used in the above indicates that this is a command that should be entered into the terminal.
>>-  these are shell commands written in `c`. 

Now you are to navigate to this directory using the following command and create your first file:

```
$  cd ELEE1119/Learning_C
$  touch helloworld.c
```
> **Note:**
>> - each line should be entered in seperately 

If we use the command `ls` we can list the content of the directory and should see at a file named 'helloworld.c'

```
$ ls
```

**Output:**
```
helloworld.c
```

Now we are going to open up and edit the content of the file and write it out: 

```
$ vim helloworld.c
```

Enter the following: 

```c
#include <stdio.h> // we need this library to get access to the input and out put methods for printing to terminal

int main()
{
    printf("Hello World\n"); // lets say hello, where it all began...
    
    printf("Goodbye World\n"); // this seems fitting as the program will close after this.
    
    return 0; // returns 0 to the int of main() and terminate the program
}
```

> **Remember**
>> - To use `i` to enter **INSERT** mode
>> - Escape key to current mode into **COMMAND** mode
>> - `:wq` write and quit

Some explanation about the above code:

- All code gets executed inside of `main()`, 

- For the program to terminate the `main()` has to have a returnable value, `int`, 

- The keyword at the end of the `main()` is `return`, this is will return the value preceeding it, 

- A `0` execute means no errors. 

- Similar to `C#` to use libraries `c` programs import with the `#include` keyword instead of `using`. 

- The included library is the standard input out header, `stdio.h`.  

- By including this header file we have access to the `printf()` function that enables us to return information to the terminal in string format.

Now we are going to compile the code so that we have an executable file that can be run from the terminal:

```
$ gcc helloworld -o helloworld.exe
```

> **Note:**
>> - `gcc` is another shell command that is built in `c`, it's purpose is to compile `.c` files into executables using the the `gcc`.
>> - Using the option `-o` we specifiy the output path/to/file
>> - For more info -> [gcc](https://man7.org/linux/man-pages/man1/gcc.1.html)

Now let's see the fruits of our labour, the file can be executed as follows:

```
$ ./helloworld.exe
```
----

<details>
<summary><b>Click for Expected Output</b></summary>
<p></p>

```
Hello World
Goodbye World
```
Congratulations, you used the programming language of the gods!

</details>

----

## Input/Output functions

In C programming, `printf()` is one of the main output function. The function sends formatted output to the screen. For example, the code below is a modified version of the helloworld programme we wrote a moment ago. 

Create a new file `vim inputoutput.c` and reproduce the code below:

```c
#include <stdio.h>    
int main()
{ 
    // Displays the string inside quotations
    printf("C Programming");
    return 0;
}
```
Remeber to use the vim shortcuts from before to edit, write and quit.

Compile and run:

```
$ gcc inputoutput.c -o inputoutput.anything
$ ./inputoutput.anything
C Programming
```
### Data Type: Printing Integer

Now we are going to modifiy the script again `$ vim inputoutput.c` to look like below:

```c
#include <stdio.h>
int main()
{
    int testInteger = 5;
    printf("Number = %d", testInteger);
    return 0;
}
```

Remeber to use the vim shortcuts from before to edit, write and quit.

Run the script again... 
```
$ ./inputoutput.anything
```

What happened? 

Well we need to recompile the code. 


```
$ gcc inputoutput.c -o inputoutput.anything
$ ./inputoutput.anything
Number = 5

```

We use `%d` format specifier to print `int` types. Here, the `%d` inside the quotations will be replaced by the value of `testInteger`.


### Data Types: Printing Float and Double

Open and modify the same file again to look like below:

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

Compile the code again using format `gcc <filesource> -o <fileoutput>`... hint what did you do before?

Run it `./<fileoutput>`: 

```
$ ./inputoutput.anything 
number1 = 13.500000
number2 = 12.400000
```

To print float, we use `%f` format specifier. Similarly, we use `%lf` to print double values.


### Data Types: Printing Characters

Open and modify the same file again to look like below:

```c
#include <stdio.h>
int main()
{
    char chr = 'a';    
    printf("character = %c", chr);  
    return 0;
} 
```

Remember to compile and then run:

```
$ ./inputoutput.anything 
character = a

```

To print `char`, we use `%c` format specifier.


### User Input in C

In C programming, `scanf()` is one of the commonly used function to take input from the user. The `scanf()` function reads formatted input from the standard input such as keyboards.

Again we will modify the program to look like the code below:

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

Compile and run:

```
$ ./inputoutput.anything
Enter an integer: 4
Number = 4
```

Here, we have used `%d` format specifier inside the `scanf()` function to take `int` input from the user. When the user enters an integer, it is stored in the `testInteger` variable.

> Notice, that we have used `&testInteger` inside `scanf()`. It is because `&testInteger` gets the address of `testInteger`, and the value entered by the user is stored in that address. We will cover addressing and pointers at a later date.


---

## Format Specifiers

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


## Data Types

Create a new file with `nano` like this:

```
$ vim dataTypeSize.c
```

We are going to write a program that returns the size of each data type availabe in `c`.

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

```
gcc dataTypeSize.c -o dataTypeSize
```

Now enter the following to see the data types and there available sizes in bytes: 

```
$ ./dataTypeSize
```

----

<details>
<summary><b>Click for Expected Output</b></summary>
<p></p>

```c
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
</details>

---
