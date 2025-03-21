# Intro to Rust

Rust is a systems programming language focused on speed, memory safety, and parallelism. It's designed to be safe, fast, and easy to use. This tutorial will walk through the basics of Rust, including its syntax, data types, and common patterns.

## 1. Variables

In Rust, variables are immutable by default. To make them mutable, you need to use the `mut` keyword.

~~~admonish code

```rust
let x = 5;  // immutable
let mut y = 10; // mutable
y = 15; // allowed because y is mutable
```

~~~

## 2. Data Types

Rust has a variety of data types. The most common ones are:

### 2.1 Scalar Types
- **Integers**: Whole numbers
  - `i32`, `u32`, `i64`, `u64`, etc.
- **Floating-point numbers**: Numbers with decimals
  - `f32`, `f64`
- **Booleans**: `true` or `false`
- **Characters**: Unicode characters
  - `char`

~~~admonish code

```rust
let a: i32 = 100;
let b: f64 = 3.14;
let c: bool = true;
let d: char = 'R';
```
~~~

### 2.2 Compound Types
- **Tuples**: Group different types into a single compound type.
- **Arrays**: Store multiple elements of the same type.

~~~admonish code

```rust
let tup: (i32, f64, char) = (500, 3.14, 'R');
let arr: [i32; 3] = [1, 2, 3];
```

~~~

## 3. Control Flow

Rust supports standard control flow structures:

- `if`, `else`
- `loop`, `while`, `for`

~~~admonish code

```rust
// If-else
let number = 6;
if number % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}

// Loop
let mut counter = 0;
loop {
    counter += 1;
    if counter == 5 {
        break;
    }
}

// For loop
for i in 0..5 {
    println!("{}", i);
}
```

~~~

## 4. Functions

In Rust, functions are declared using the `fn` keyword. Parameters and return types are explicitly defined.

~~~admonish code

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

let result = add(3, 4);
println!("Sum is: {}", result);
```

~~~

## 5. Ownership and Borrowing

Rust's memory management is based on ownership, borrowing, and lifetimes, which helps ensure memory safety without a garbage collector.

- **Ownership**: Each value in Rust has a single owner.
- **Borrowing**: References to data can be borrowed (either mutably or immutably).

~~~admonish code

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = &s1; // Immutable borrow
    println!("{}", s2);
}
```

~~~

## 6. Keywords

Here are some important Rust keywords:

- `let`, `mut`: Variable binding and mutability
- `fn`: Function declaration
- `if`, `else`, `while`, `for`, `loop`: Control flow
- `match`: Pattern matching
- `struct`, `enum`: Data structures
- `impl`: Implementation block
- `mod`: Module declaration

## 7. Common Rust Patterns

Rust encourages functional programming patterns:

- **Pattern Matching**: Using `match` for more complex decision making.
- **Result and Option**: For error handling and optional values.

~~~admonish code

```rust
let result = Some(10);

match result {
    Some(x) => println!("Found: {}", x),
    None => println!("Not found"),
}
```

~~~

~~~admonish important

`Some` is an `enum` variant used in the `Option` type. The `Option` type is a way of representing a value that might or might not be present. It's commonly used for error handling or situations where a value could be missing.

~~~

## 8. Conclusion

Rust's syntax may take some time to learn, but its emphasis on memory safety and concurrency makes it a powerful tool for system programming.