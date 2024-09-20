# Pin Exploration

## Understanding BeagleBoard GPIO Pin Mapping and Device Tree Setup

To understand how the BeagleBoard sets up pin mappings using Device Tree Source files (.dts) and calculates the correct GPIO number (`gpioXXX`) under `/sys/class/gpio`, let's break down the process step-by-step:

### 1. Device Tree Source (.dts) Files

The BeagleBoard uses Device Tree Source (.dts) files to describe its hardware layout and configuration. These files are compiled into Device Tree Blobs (.dtb), which the Linux kernel reads at boot time to understand the hardware setup.

A `.dts` file contains descriptions of the board's hardware components, including processors, memory, peripherals, and importantly, the General Purpose Input/Output (GPIO) pins.

### 2. Pin Multiplexing and Pin Control

**Pin multiplexing** allows a single physical pin on a processor to serve multiple functions, depending on the configuration. The `.dts` file defines how each pin on the BeagleBoard is multiplexed:

```dts
pinctrl-name = "default";
pinctrl-0 = <&my_pins>;

my_pins: pinmux_my_pins {
    pinctrl-single,pins = <
        0x034 (PIN_OUTPUT | MUX_MODE7)  /* Pin X configuration */
        0x038 (PIN_INPUT | MUX_MODE7)   /* Pin Y configuration */
    >;
};
```

In this example:

- `0x034` and `0x038` are addresses in the pin control register.
- `PIN_OUTPUT | MUX_MODE7` and `PIN_INPUT | MUX_MODE7` specify the pin's mode and direction.
- Overlays can be found here for the BB -> [https://github.com/pmunts/muntsos/tree/master/boot/BeagleBone/overlays](https://github.com/pmunts/muntsos/tree/master/boot/BeagleBone/overlays)

#### 2.1 Understanding BeagleBoard DTS File Configuration for GPIO Pin

In a BeagleBoard Device Tree Source (.dts) file, pin configurations are defined using specific properties that control how each pin operates. Let’s break down the following example to understand what it does:

```dts
8_11_gpio_input_pin: pinmux_P8_11_gpio_input_pin { 
    pinctrl-single,pins = <
        ((((0x0834)) & 0xffff) - (0x0800)) (((1 << 5) | (1 << 3)) | 7) 
    >; 
};
```

#### 2.2 Explanation of Each Part

1. **Label (`8_11_gpio_input_pin`) and Node Name (`pinmux_P8_11_gpio_input_pin`)**:
   - `8_11_gpio_input_pin:` is a label that can be referenced elsewhere in the device tree.
   - `pinmux_P8_11_gpio_input_pin` is the name of this pin configuration node.

2. **`pinctrl-single,pins` Property**:
   - This property defines a list of pin configuration settings for the pins controlled by the `pinctrl-single` driver. The syntax follows the specific format needed to define the pin's multiplexing and electrical settings.

3. **Pin Configuration Value**:
   - The value within the `pinctrl-single,pins` property is given as a tuple of two values: the register offset and the value to be written to that register.

   ```dts
   ((((0x0834)) & 0xffff) - (0x0800)) (((1 << 5) | (1 << 3)) | 7)
   ```

   This is split into two main parts:
   
   - **Register Offset Calculation**: `((((0x0834)) & 0xffff) - (0x0800))`
   - **Pin Configuration Value**: `(((1 << 5) | (1 << 3)) | 7)`

Let's explain these parts in detail:

#### 2.3 Register Offset Calculation

```dts
((((0x0834)) & 0xffff) - (0x0800))
```

- **`0x0834`**: This is the address in the memory-mapped I/O space for the pin's configuration register. It's where the pin configuration settings will be applied.

- **`0xffff`**: This mask ensures that only the lower 16 bits of the address are considered, which aligns with the hardware addressing limitations.

- **Bitwise AND (`&`)**: `((0x0834) & 0xffff)` masks the address to retain only the lower 16 bits.

- **Subtracting `0x0800`**: `- (0x0800)` adjusts the base address. The `pinctrl-single` driver expects register offsets to be zero-based relative to a certain base address (often `0x0800`), so this calculation normalizes the address to start from zero.

  Thus, `((((0x0834)) & 0xffff) - (0x0800))` computes the zero-based offset for the pin configuration register in the `pinctrl-single` driver's address space.

#### 2.4 Pin Configuration Value

```dts
(((1 << 5) | (1 << 3)) | 7)
```

- **`1 << 5`**: This shifts the binary `1` five bits to the left, resulting in the binary value `0b100000` or `0x20`.

- **`1 << 3`**: This shifts the binary `1` three bits to the left, resulting in the binary value `0b1000` or `0x08`.

- **Bitwise OR (`|`)**: `(1 << 5) | (1 << 3)` combines these two binary values using a bitwise OR, resulting in `0b101000` or `0x28`.

- **`| 7`**: This further modifies the configuration by applying another OR operation with `7` (`0b111`), resulting in `0b101111` or `0x2F`.

#### 2.5 What Does the Configuration Value Do?

The final configuration value, `0x2F`, encodes multiple pin settings:

- **Direction**: GPIO pins can be configured as input or output.
- **Pull-up/Pull-down resistors**: Determines if internal resistors are enabled.
- **Mode Selection**: This determines which function the pin will perform (GPIO, UART, I2C, etc.). 

In this context, the value `0x2F` could represent a specific configuration for the pin, such as setting it to GPIO mode, enabling input, and possibly enabling pull-up resistors. The exact meaning would depend on the specific configuration bits defined in the processor's datasheet or reference manual.

### 3. GPIO Pin Naming Convention (GPIOX_YY)

Each GPIO pin on a BeagleBoard has a naming convention:

- `GPIOX_YY`, where:
    - `X` is the GPIO bank number.
    - `YY` is the pin number within that bank.

For example, `GPIO2_13` means:

- It’s the 13th pin (0-based, so it's the 14th physical pin) of GPIO bank 2.

### 4. Calculating the Correct GPIO Number (`gpioXXX`) in `/sys/class/gpio`

To interact with GPIOs in Linux, you use the `/sys/class/gpio` interface, which requires a global GPIO number (gpioXXX), calculated as:

\\[gpioXXX = ( x \cdot 32 ) + yy\\]

Where:

- \\(x\\) is the GPIO bank number.
- \\(yy\\) is the pin number within the bank.

Example Calculation:

For `GPIO2_13`:

- \\(x = 2\\) 
- \\(yy = 13\\)

The global GPIO number is:

\\[gpioXXX = ( 2 \cdot 32 ) + 13 = 64 + 13 = 77\\]

So, `GPIO2_13` corresponds to `gpio77`.



### 5. Mapping the gpio pins to the P8/9 pins

1. **What is `/sys/class/gpio?`**

    `/sys/class/gpio` is a part of the sysfs filesystem in Linux, which provides a user-space interface to interact with GPIO (General Purpose Input/Output) pins. GPIO pins are commonly used in embedded systems, like the BeagleBoard, to interface with external hardware (sensors, LEDs, buttons, etc.).

    The `/sys/class/gpio` directory contains subdirectories and files that represent each GPIO pin controlled by the Linux kernel. Through this interface, you can:

     -  **Export** GPIO pins to user space for direct control.
     -  **Set the direction** (input or output) of GPIO pins.
     -  **Read** from or write to GPIO pins.
    
    Each GPIO pin that is controlled by the kernel is represented by a directory named gpioXXX, where XXX is the GPIO number.

    You can access the (gpioX) pins label to map the /sys/class/gpio/gpio to the breackout pin: 

    ```sh
    $ cat /sys/class/gpio/gpio115/label
    > P9_27
    ```
 
2. **Build map for the GPIO and Lable**

    The provided Bash script is designed to create a CSV file `(gpio_map.csv`) that maps each GPIO number to its label. Here is what each part of the script does:

    ```sh
    #!/usr/bin/env bash
    echo "GPIO,Label" > gpio_map.csv
    for gpio in /sys/class/gpio/gpio*; do
        gpio_num=$(basename "$gpio")
        label=$(cat "$gpio/label")
        echo "$gpio_num,$label" >> gpio_map.csv
    done
    ```

    Run the following now to see the map:

    ```sh
    $ cat gpio_map.csv
    > 
    GPIO,Label
    gpio10,P8_31
    gpio11,P8_32
    gpio110,P9_31
    gpio111,P9_29
    gpio112,P9_30
    gpio113,P9_28
    gpio114,P9_92
    gpio115,sysfs
    gpio116,P9_91
    gpio117,P9_25
    gpio12,P9_20
    gpio13,P9_19
    gpio14,P9_26
    gpio15,P9_24
    ...
    ```

### 6. Understanding config-pin and the Importance of Knowing Pin Modes

1. **What is config-pin?**

    `config-pin` is a command-line utility used on BeagleBoard (like BeagleBone Black) to configure the pin modes of the GPIO (General Purpose Input/Output) pins. The BeagleBoard has multiple headers (P8 and P9) with several pins that can serve various functions depending on their configuration.

    The config-pin tool allows you to change the function of a specific pin on the fly without needing to modify or recompile the device tree files (.dts). This tool is part of the bb-cape-overlays package and provides a straightforward way to set a pin’s mode dynamically.

2. **Why Do We Need to Know Pin Modes?**

    Each pin on the BeagleBoard is multipurpose and can be configured to operate in different modes. These modes determine the function of the pin, such as:

    - **GPIO (General Purpose Input/Output)**: The pin can be used as a digital input or output, can pull up or pull down.
    - **UART (Universal Asynchronous Receiver/Transmitter)**: The pin can be used for serial communication.
    - **I2C (Inter-Integrated Circuit)**: The pin can be used for I2C communication.
    - **SPI (Serial Peripheral Interface)**: The pin can be used for SPI communication.
    - **PWM (Pulse Width Modulation)**: The pin can be used to output PWM signals.
    - **Analog Input**: The pin can be used to read analog voltage levels.

    Knowing the available modes for each pin is essential because:

    - **Correct Hardware Configuration**: To connect external hardware (like sensors, LEDs, or communication modules), you must set the pins to the correct mode. For example, if you're connecting a UART device, the pins must be in UART mode.

    - **Avoiding Conflicts**: Certain peripherals or external devices require exclusive use of specific pins. If the pins are not correctly configured, there could be conflicts leading to hardware malfunction or communication errors.

    - **Optimal Use of Resources**: Understanding pin modes helps you make the most of the available hardware resources. The BeagleBoard has limited pins, and each can serve multiple roles. Correctly configuring them allows you to maximize functionality.

    - **Flexibility in Development**: Knowing how to use config-pin to change modes enables flexibility during development and testing. You can quickly reconfigure pins for different functions without needing to reboot or recompile.


3. **How to Use config-pin**:

    The config-pin tool syntax is straightforward. Here’s how you use it:

    1. Check Available Modes for a Pin:

        To see what modes are available for a specific pin:
        
        ```sh
        config-pin -l <pin>
        ```

        Example:

        ```sh
        $ config-pin -l P9.12
        > Available modes for P9_12 are: default gpio gpio_pu gpio_pd gpio_input
        ```
    2. Current configured mode: 

        ```sh
        config-pin -q <pin>
        ```

        Example: 

        ```sh
        $ config-pin -q P9.12
        > Current mode for P9_12 is:     default
        ```

    
    3. To check all configurations we can write a script:

        <details>
        <summary>Suppressed code here [52 lines] ... </summary>

        ```sh
        #!/usr/bin/env bash

        # Output file
        OUTPUT_FILE="pin_config_report.txt"

        # List of all pins on P8 and P9 headers (BeagleBone Black)
        PINS=(
            P8_3 P8_4 P8_5 P8_6 P8_7 P8_8 P8_9 P8_10
            P8_11 P8_12 P8_13 P8_14 P8_15 P8_16 P8_17 P8_18
            P8_19 P8_20 P8_21 P8_22 P8_23 P8_24 P8_25 P8_26
            P8_27 P8_28 P8_29 P8_30 P8_31 P8_32 P8_33 P8_34
            P8_35 P8_36 P8_37 P8_38 P8_39 P8_40 P8_41 P8_42
            P8_43 P8_44 P8_45 P8_46
            P9_11 P9_12 P9_13 P9_14 P9_15 P9_16 P9_17 P9_18
            P9_19 P9_20 P9_21 P9_22 P9_23 P9_24 P9_25 P9_26
            P9_27 P9_28 P9_29 P9_30 P9_31 P9_41 P9_42 P9_92
            P9_93
        )
        # Clear or create the output file and add the header
        echo "Pin     | Current Mode       | Available Modes" > "$OUTPUT_FILE"
        echo "-----------------------------------------------" >> "$OUTPUT_FILE"

        # Iterate over each pin and get its current and possible configurations
        for PIN in "${PINS[@]}"; do
            echo "Checking configuration for $PIN..."

            # Capture the output of config-pin command
            CURRENT_MODE_OUTPUT=$(config-pin -q "$PIN" 2>&1)

            # Check if the output contains "open()"
            if [[ "$CURRENT_MODE_OUTPUT" == *"open()"* ]]; then
                CURRENT_MODE="-"
            else
                CURRENT_MODE=$(echo "$CURRENT_MODE_OUTPUT" | awk -F': ' '{print $2}' | xargs)
            fi

            # Capture the output of possible modes
            POSSIBLE_MODES_OUTPUT=$(config-pin -l "$PIN" 2>&1)

            # Check if the output contains "open()"
            if [[ "$POSSIBLE_MODES_OUTPUT" == *"open()"* ]]; then
                POSSIBLE_MODES="-"
            else
                POSSIBLE_MODES=$(echo "$POSSIBLE_MODES_OUTPUT" | tr -d '\n' | awk -F ':' '{print$2}' | xargs)
            fi

            # Write results to output file with formatted columns
            printf "%-7s | %-18s | %s\n" "$PIN" "$CURRENT_MODE" "$POSSIBLE_MODES" >> "$OUTPUT_FILE"
        done

        echo "Pin configuration report saved to $OUTPUT_FILE"
        ```

        </details>

    4. Run the following to see the report:
    
        ```sh
        $ less pin_config_report.txt
        ```
        
        <details>
        <summary>This is the output...</summary>

        ```
        Pin     | Current Mode       | Available Modes
        -----------------------------------------------
        P8_3    | -                  | -
        P8_4    | -                  | -
        P8_5    | -                  | -
        P8_6    | -                  | -
        P8_7    | -                  | -
        P8_8    | -                  | -
        P8_9    | -                  | -
        P8_10   | default            | default gpio gpio_pu gpio_pd gpio_input timer
        P8_11   | default            | default gpio gpio_pu gpio_pd gpio_input qep pruout
        P8_12   | default            | default gpio gpio_pu gpio_pd gpio_input qep pruout
        P8_13   | default            | default gpio gpio_pu gpio_pd gpio_input pwm
        P8_14   | default            | default gpio gpio_pu gpio_pd gpio_input pwm
        P8_15   | default            | default gpio gpio_pu gpio_pd gpio_input qep pru_ecap pruin
        P8_16   | default            | default gpio gpio_pu gpio_pd gpio_input qep pruin
        P8_17   | default            | default gpio gpio_pu gpio_pd gpio_input pwm
        P8_18   | default            | default gpio gpio_pu gpio_pd gpio_input
        P8_19   | default            | default gpio gpio_pu gpio_pd gpio_input pwm
        P8_20   | -                  | default gpio gpio_pu gpio_pd gpio_input pruout pruin
        P8_21   | -                  | default gpio gpio_pu gpio_pd gpio_input pruout pruin
        ...
        ```

        </details>

    5. Set a Pin Mode:

        ``sh
        config-pin <pin> <mode>
        ``` 

        Example:

        ```sh
        config-pin P9.12 uart
        ```

        This command sets pin P9.12 to UART mode.

    6. Verify current pins

        ```sh
        config-pin -q <pin>
        ```

    > **Note:**
    >> - Any pins you have set manually to do not presist across power cycling. 
    >> - You could write a script that configures all the pins after boot, after the kernel has pre-loaded maps. 
    >> - Alternatively you could make your own `.dts`!