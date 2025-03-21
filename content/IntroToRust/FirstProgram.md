# First Program

## 1. Git fork.... 

~~~admonish tip

Go to here and fork the follow repo : 

- [https://github.com/UniOfGreenwich/learn-rust-with-github-codespaces/fork](https://github.com/UniOfGreenwich/learn-rust-with-github-codespaces/fork)

Working together we play with the initial code.

~~~

## 2. Rust Lab: Mocking Text Input

### 2.1 **Importing Modules**

Modify  `src/main.rs` by importing the following modules at the top of script: 


~~~admonish code

```rust
use std::io;
use std::env;
```
~~~

~~~admonish example title='Explanation'

- `std::io`: Provides tools for input/output operations, such as reading user input.
- `std::env`: Gives access to environment variables and command-line arguments.
- `::` : operator is used to access an item inside a module

~~~

### 2.2 **Main Function**

Continue into the `main` block, removing the `println!` macro.

~~~admonish code

```rust
fn main() {
    let mut input = String::new();
    let mut mock = String::new();
```

~~~

~~~admonish example title='Explanation'

- `main`: Entry point of the program.
- `input`: A mutable `String` variable to store user or argument input.
- `mock`: A mutable `String` to build the "mocked" output.

~~~

---

### 2.3 **Getting Command-Line Arguments**

Now on a new line after the above variables, add a `Vec` with type `String`, that collects the the arguments passed to the program via the command line

~~~admonish code

```rust
let args: Vec<String> = env::args().collect();
```

~~~

~~~admonish example title='Explanation'

- Collects command-line arguments into a `Vec<String>`.
- `args[0]` is always the name of the program, so we check for additional arguments.

~~~

---

### 2.4 **Handling Input**

Now that there is functionality to collect the arguments to the program into a vector of strings. We want to create functionality to read the arguments directly when the program is invoked via the CLI, or if not present then request input from the user.

~~~admonish code 

```rust
input = match args.get(1) {
    Some(value) => value.to_string(),
    None => {
        println!("What would you like to mock?");

        io::stdin().read_line(&mut input)
            .expect("fAiLeD tO rEaD LiNe");
        input
    },
};
```

~~~

~~~admonish example title='Explanation'

- **If argument exists**: Assign it to `input`.
- **If argument doesn't exist**: Prompt the user for input and read it from standard input.
- `expect`: Halts the program with a custom error message if reading input fails.
- `match` is a powerful pattern matching construct in Rust. It allows you to `match` a value against different patterns and execute corresponding code blocks based on which pattern matches. It's similar to a switch statement in other languages but more flexible.
- `Some(value)` is a variant of the `Option` `enum` in Rust, which represents the presence of a value. In this case, if `args.get(1)` returns `Some(value)`, it means a command-line argument was passed
- `None` is another variant of the `Option` `enum`, representing the absence of a value. If no command-line argument was passed (i.e., `args.get(1)` returns `None`), the code inside the `None` branch will be executed. In this case, it will ask the user for input.
- `expect()` is a method on `Result` that either returns the `Ok` value or `panics` with the provided message if it encounters an `Err` variant. This method is used here to ensure that if reading from stdin fails (for example, due to an I/O error), the program will panic with the message `"fAiLeD tO rEaD LiNe"`. This is a somewhat humorous or exaggerated way of indicating an error

~~~

---

### 2.5 **Normalizing Input**

To normalize the the inputted string, we can set the string to all lowercase. 

~~~admonish code

```rust
let input = input.trim().to_ascii_lowercase();
```

~~~

~~~admonish example title='Explanation'

- `trim`: Removes leading and trailing whitespace.
- `to_ascii_lowercase`: Converts the string to lowercase.

~~~

---

### 2.6 **Setting Up State Variable**

To keep track of the the type of letter case we are using at anyone time we have a boolean 

~~~admonish code

```rust
let mut is_uppercase = false;
```

~~~

~~~admonish example title='Explanation'

- Tracks whether the next letter should be uppercase.

~~~

---

### 2.7 **Transforming Input**

Underneath the code above add the functionality to loop over every letter in the vector `input` and change it to upper or keep as lower case. We need to check if the index value of the string `input`  is of type alpha, rather than numeric in order to convert the value to upper case too.

~~~admonish code

```rust
for c in input.chars() {
    if c.is_alphabetic() & is_uppercase {
        mock.push(c.to_uppercase().collect::<Vec<_>>()[0]);
        is_uppercase = false;
    } else {
        mock.push(c);
        if c.is_alphabetic() {
            is_uppercase = true;
        }
    }
}
```

~~~

~~~admonish example title='Explanation'

- **Loop through each character (`c`) in `input`**:
  - If `c` is alphabetic and `is_uppercase` is `true`:
    - Convert to uppercase and append to `mock`.
    - Reset `is_uppercase` to `false`.
  - Otherwise, append `c` as-is and toggle `is_uppercase` if it's alphabetic.
- **Purpose**: Alternate between uppercase and lowercase letters for alphabetic characters.

~~~

---

### 2.8 **Output the Result**

Once all conversions have happened the program should return the output to the user via standard out.

~~~admonish code 

```rust
println!("{}", mock);
```

~~~

~~~admonish example title='Explanation'

- Print the transformed `mock` string.
- `println!` is a macro used to print text to the console.

~~~

---

## 3. Compile 

To compile the code: 

~~~admonish terminal

```sh
$ cargo build
```

~~~

---

## 4. Example Execution

### 4.1 Case 1: With Argument

~~~admonish terminal 

```sh
$ ./target/debug/hello "hello world"
hElLo WoRlD
```

~~~

### 4.2 Case 2: Without Argument

~~~admonish terminal 

```sh
$ ./target/debug/hello
What would you like to mock?
hello world
hElLo WoRlD
```

~~~

---

## 5.Concepts Covered
1. Command-line arguments.
2. Reading user input.
3. String manipulation.
4. Control flow with `match` and `for` loops.
5. Rust's ownership and mutability rules.

---


~~~admonish code collapsible=true title="Full Code" 

```rust
use std::io;
use std::env;

fn main() {
    let mut input = String::new();
    let mut mock = String::new();

    let args: Vec<String> = env::args().collect();

    input = match args.get(1) {
        Some(value) => value.to_string(),
        None => {
            println!("What would you like to mock?");

            io::stdin().read_line(&mut input)
                .expect("fAiLeD tO rEaD LiNe");
            input
        },
    };

    let input = input.trim().to_ascii_lowercase();

    let mut is_uppercase = false;

    for c in input.chars() {
        if c.is_alphabetic() & is_uppercase {
            mock.push(c.to_uppercase().collect::<Vec<_>>()[0]);
            is_uppercase = false;
        } else {
            mock.push(c);
            if c.is_alphabetic() {
                is_uppercase = true;
            }
        }
    }

    println!("{}", mock)
}
```
~~~

---

~~~admonish tip title='Extra Exercises:'

1. Modify the code to toggle letters only for vowels.

2. Change the code to handle multiple command-line arguments.

3. You can explore further concepts via rust doc: 
    - [https://doc.rust-lang.org/stable/rust-by-example/index.html](https://doc.rust-lang.org/stable/rust-by-example/index.html)
~~~