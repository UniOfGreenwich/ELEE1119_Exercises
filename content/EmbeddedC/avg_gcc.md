
# avr-gcc and avrdude

## 1. AVR-GCC: The Compiler for AVR Microcontrollers

~~~admonish note

**avr-gcc** is a compiler based on the GNU Compiler Collection (GCC) tailored for AVR microcontrollers, such as those made by Microchip. It translates C code into machine code specific to the AVR architecture, enabling the programming of microcontrollers like the ATmega328P and ATtiny series.

~~~

## 2. Setting Up `avr-gcc`

1. To begin programming with `avr-gcc`, ensure the following software is installed:

    ~~~admonish example title="Explanation"

    1. **avr-gcc**: The compiler for AVR microcontrollers.
    2. **avrdude**: A utility for uploading compiled code to the microcontroller.
    3. **Makefile (optional)**: For automating the compilation and uploading process.

    ~~~


### 2.2 Adding avr-gcc and avrdude for compiling and uploading to your PATH

2. Add either of the following to your `~/.bashrc` file 

 - If you are on a university PC then:

    ~~~admonish code

    ```bash
    export PATH=$PATH:"/c/ProgramData/arduino-ide-v2/Local/Arduino15/packages/arduino/tools/avr-gcc/7.3.0-atmel3.6.1-arduino7/bin"
    export PATH=$PATH:"/c/ProgramData/arduino-ide-v2/Local/Arduino15/packages/arduino/tools/avr-dude/6.3.0-arduino17/bin"
    ```

    ~~~

 - If you are on a on your own windows PC then:

    ~~~admonish code

    ```bash
    export PATH=$PATH:"/c/users/yourusername/AppData/Local/Arduino15/packages/arduino/tools/avr-gcc/7.3.0-atmel3.6.1-arduino7/bin"
    export PATH=$PATH:"/c/users/yourusername/AppData/Local/Arduino15/packages/arduino/tools/avr-dude/6.3.0-arduino17/bin"
    ```

    ~~~