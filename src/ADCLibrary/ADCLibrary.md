# ADC Library Creation and System-Wide Installation Guide

This guide will detail how to set up the BeagleBone Black (BBB) to use its Analog-to-Digital Converter (ADC) capabilities. ADCs are crucial for interfacing with analog sensors, such as temperature sensors, potentiometers, and light sensors, converting analog signals into digital data that the BBB can process. The BBB provides several onboard ADCs that allow reading analog values directly through the Linux filesystem. This walkthrough will guide you through the steps needed to create a reusable ADC library in C, compile it into both static and shared libraries, and install it system-wide on the BBB.

## 1. Linux Kernel Version

This guide assumes that your BBB is running Linux Kernel 4.1.15 or later. If you're using an earlier version, such as 3.8.x, there may be differences in how GPIOs and ADCs are handled, and additional steps might be necessary.

## 2. Introduction to BeagleBone Black's ADC Capabilities

The BeagleBone Black (BBB) has a built-in ADC subsystem that can read analog signals on specific pins. The ADC subsystem can read voltages between 0 and 1.8V and convert them into a digital value. On the BBB, ADC values are accessed through the sysfs interface at `/sys/bus/iio/devices/iio:device0`.

### 2.1 ADC Numbering Scheme

Each ADC channel on the BBB is identified by a number. For example, `in_voltage0_raw` corresponds to ADC channel 0, `in_voltage1_raw` to channel 1, and so on. The raw files provide the raw digital conversion value, which can be scaled as needed based on the application.

### 2.2 Why Create a Library for ADC?

Creating a library for ADC operations offers several advantages:

1. **Simplification**: Abstracts the complex file handling operations, making the code more readable and easier to maintain.

2. **Reusability**: The library can be reused across multiple projects without duplicating code.

3. **Consistency**: Ensures consistent handling of ADC operations and error management across different parts of an application or different projects.

4. **System-Wide Access**: By installing the library system-wide, any user or application can easily access the ADC functionality without duplicating setup steps.

## 3. Interacting with ADC on BeagleBone Black via Sysfs

To read ADC values on the BBB, you interact with files in the `/sys/bus/iio/devices/iio:device0` directory. Here’s how to perform common ADC operations using the sysfs interface:

### 3.1 What is the ADC chip?

```sh
$  cat /sys/bus/iio/devices/iio\:device0/name
TI-am336x-adc
```

You can review the documentation here: [https://www.ti.com/lit/an/sprabu5/sprabu5.pdf](https://www.ti.com/lit/an/sprabu5/sprabu5.pdf)

Source code for the driver can be found here: [https://github.com/torvalds/linux/blob/master/drivers/iio/adc/ti_am335x_adc.c](https://github.com/torvalds/linux/blob/master/drivers/iio/adc/ti_am335x_adc.c)


The BeagleBone Black (BBB) includes an Analog-to-Digital Converter (ADC) subsystem, which allows the board to interface with various analog sensors. This subsystem converts analog voltage signals into digital values that the processor can use.

### 3.2 Key Characteristics of the BeagleBone Black ADC

1. **Resolution**: The BBB’s ADC is 12-bit, meaning it can represent an analog input voltage as a digital value between 0 and 4095 \\((2^{12} - 1)\\).

2. **Voltage Range**: The ADC on the BBB can read voltages from 0V up to 1.8V. **It is crucial to note that applying a voltage higher than 1.8V directly to an ADC pin can damage the board.** Voltage dividers or other protective circuits should be used if you're measuring voltages higher than 1.8V.

3. **Number of Channels**: The BBB has 7 usable ADC channels, labeled from `in_voltage0_raw` to `in_voltage6_raw`. These channels correspond to specific analog input pins on the P9 header.

4. **Sampling Rate**: The BBB’s ADC can sample up to about 200k samples per second, depending on the configuration and system load. This is sufficient for many applications like reading sensor data, but may not be suitable for very high-frequency signals.

## 4. How ADC Works on the BeagleBone Black

Analog-to-Digital Converters (ADCs) work by sampling an analog voltage signal and converting it to a digital number that represents the magnitude of the analog signal. This digital representation is what the processor works with. Here’s how it works in practice on the BBB:

1. **Analog Voltage Input**: The ADC reads an analog input voltage on one of its channels.

2. **Digital Representation**: The ADC converts this voltage to a digital value between 0 and 4095. A value of 0 corresponds to 0V, and a value of 4095 corresponds to 1.8V.

3. **Voltage-to-Digital Conversion Formula**: The conversion from raw ADC reading to voltage can be calculated using the formula:

   \\[
   \\text{Voltage (V)} = \frac{\\text{ADC Reading}}{4095} \times 1.8
   \\]

   - **ADC Reading**: The raw value read from the `in_voltageX_raw` file.
   - **1.8**: The reference voltage (1.8V), which is the maximum input voltage that the ADC can read without damage.

4. **Read the Raw ADC Value**:

   Let's assume we want to read from `ADC Channel 0`. First, navigate to the appropriate directory and read the value:

   ```bash
   $ cd /sys/bus/iio/devices/iio:device0
   $ cat in_voltage0_raw
   ```

   Suppose the command returns a value of `2048`.

5. **Convert the Raw Value to a Voltage**:

   Use the formula mentioned earlier to convert the raw ADC value to a voltage:

   \\[
   \\text{Voltage (V)} = \frac{2048}{4095} \times 1.8 = 0.9 \, \\text{V}
   \\]

   This means the analog signal at `ADC Channel 0` corresponds to a voltage of approximately 0.9V.


### 5. List Available ADC Channels

The BeagleBone Black (BBB) allows you to interact with its Analog-to-Digital Converter (ADC) through the sysfs interface, located at `/sys/bus/iio/devices/iio:device0`. This directory contains various files and subdirectories that provide access to the ADC hardware and its configuration. Below is an explanation of each file and subdirectory you might see when you run ls in this directory:

```bash
$ cd /sys/bus/iio/devices/iio:device0
$ ls -l
buffer  in_voltage0_raw  in_voltage2_raw  in_voltage4_raw  in_voltage6_raw  name     power          subsystem
dev     in_voltage1_raw  in_voltage3_raw  in_voltage5_raw  in_voltage7_raw  of_node  scan_elements  uevent
```

**Explanation of Files and Directories**:

1. `buffer`

    - **Purpose**: This directory contains files related to buffer management for the ADC.

    - **Usage**: Buffering is typically used in applications requiring continuous data sampling (like high-frequency sensor data collection). Configuring the buffer allows you to read multiple samples at once, which is more efficient than reading single samples one at a time.

    - **Details**: This directory is often used in advanced applications where high-speed data acquisition is needed.

2. `in_voltageX_raw` (e.g., `in_voltage0_raw`, `in_voltage1_raw`, ... `in_voltage7_raw`)

    - **Purpose**: These files represent the raw ADC values read from the corresponding ADC channels (0 through 7).

    - **Values**: Reading from these files returns an integer representing the digital conversion of the analog signal present on the corresponding ADC pin.

    - **Usage**: You can use the cat command to read the raw ADC value from a specific channel:

        ```bash
        $ cat in_voltage0_raw
        ```
    - **Details**: The raw value is typically between 0 and 4095 for a 12-bit ADC, representing the analog voltage scaled between 0V and the reference voltage (1.8V on the BBB).
    
3. `name`

    - **Purpose**: This file provides the name of the ADC device.

    - **Usage**: Reading this file returns a string that typically identifies the ADC controller's driver name, which might look something like `TI-am335x-adc`.

    - **Details**: Knowing the driver name can help in debugging or configuring specific driver-related parameters.

4. `dev`

    - **Purpose**: This file represents the device number assigned to the ADC by the Linux kernel.

    - **Details**: This is typically used internally by the kernel and device management systems to handle device nodes and their associations.

5. `of_node`

    - **Purpose**: This directory represents the device tree node associated with the ADC hardware.

    - **Details**: The device tree is a data structure that describes the hardware components of the system to the operating system. The of_node directory can contain properties that reflect how the hardware is described in the device tree source.

    - **Usage**: Typically used for debugging or understanding hardware configuration, not usually modified by end-users.

6. `power`

    - **Purpose**: This directory contains power management files for the ADC device.

    - **Usage**: You can use the files within this directory to manage the power state of the ADC. For example, some systems might allow you to enable or disable the ADC to save power when it's not in use.

    - **Details**: This is often used in power-constrained environments where the ADC might be turned off to save energy.

7. `scan_elements`

    - **Purpose**: This directory contains files related to configuring scan elements for buffered readings.
    
    - **Usage**: In applications where multiple channels are read in a scan sequence (multi-channel ADC reads), this directory is used to configure which channels are included in the scan and in what order.
    
    - **Details**: This is advanced functionality typically used in applications requiring synchronized sampling of multiple inputs.

8. `subsystem`

    - **Purpose**: This is a symbolic link pointing back to the subsystem the device belongs to, in this case, the IIO (Industrial I/O) subsystem.

    - **Details**: This link provides context within the broader sysfs tree, showing how devices are organized under different subsystems (like GPIO, IIO, etc.).

    - **Usage**: Generally used by system software for managing device trees and hierarchies.

9. `uevent`

    - **Purpose**: This file is used by udev, the device manager for the Linux kernel, to manage dynamic device nodes.

    - **Usage**: When read, this file provides environment variables for udev events, allowing you to see or modify the device's event handling configuration.

    - **Details**: This is typically managed automatically and not frequently modified by users.

### 6. Making a ADC C Library

1. Create a new directory called adc in home with the following files: 

    ```sh
    $ mkdir adc && cd && touch adc.c && touch adc.h && touch MakeFile
    ```
2. Edit the `adc.h` file: 
    <details>
    <summary>Suppressed Code here [24 lines]...</summary>

    ```h
    #ifndef ADC_H_
    #define ADC_H_

    #define SYSFS_ADC_DIR "/sys/bus/iio/devices/iio:device0"

    #define POLL_TIMEOUT (3 * 1000) /*3 seconds*/

    #define MAX_BUF 256
    #define ADC_BUF 6

    int adc_get_value(unsigned int adcPin, unsigned int *value);
    int adc_fd_open(unsigned int gpio);
    int adc_fd_close(unsigned int fd);
    int adc_en(unsigned int adcPin, unsigned int en);

    #endif /* ADC_H_*/
    ```
    </details>

3. Now we can modify the `adc.c` file:

    <details>
    <summary>Suppressed Code here [60 lines]...</summary>

    ```c
    #include "adc.h"
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include <errno.h>
    #include <unistd.h>
    #include <fcntl.h>
    #include <poll.h>

    /****************************************************************
    * adc_get_value
    ****************************************************************/
    int adc_get_value(unsigned int adcPin, unsigned int *value){
        int fd;
        char buf[MAX_BUF];
        char retChars[ADC_BUF];

        snprintf(buf, sizeof(buf), SYSFS_ADC_DIR "/in_voltage%d_raw", adcPin);

        fd = open(buf, O_RDONLY);
        if (fd < 0) {
            perror("adc/get-value");
            return fd;
        }

        read(fd, retChars, 6);

        *value = strtol(retChars,NULL,0);

        close(fd);
        return 0;
    }

    /****************************************************************
    * adc_fd_open
    ****************************************************************/

    int adc_fd_open(unsigned int adcPin){
        int fd;
        char buf[MAX_BUF];

        snprintf(buf, sizeof(buf), SYSFS_ADC_DIR "/in_voltage%d_raw", adcPin);

        fd = open(buf, O_RDONLY | O_NONBLOCK );
        if (fd < 0) {
            perror("adc/fd_open");
        }
        return fd;
    }

    /****************************************************************
    * adc_fd_close
    ****************************************************************/

    int adc_fd_close(unsigned int fd){
        return close(fd);
    }
    ```
    </details>

4. Much like the GPIO library we can build libraries manually, compile `adc.c` into an Object File by Using the following command to compile `adc.c` into an object file (`adc.o`):

    ```sh
    $ gcc -c adc.c -o adc.o
    ```

4. Create a Static Library (`libadc.a`) to create a static library, use the `ar` command:

    ```sh
    $ ar rcs libadc.a adc.o
    ```

   - **Command Breakdown:**
     - `ar`: The archiver tool used to create and maintain library archives.
     - `rcs`: Flags where r inserts the files into the archive, c creates the archive if it doesn't exist, and s creates an index for quick symbol lookup.
     - `libadc.a`: The name of the static library being created.
     - `adc.o`: The object file to be included in the library.

    >> **Explanation: What is a Static Library?**
    >>
    >> A static library is a collection of object files that are linked into the final executable at compile time. Once linked, the code from the static library becomes part of the executable binary. This means that the executable will carry a copy of the library's code, making it self-contained and independent of the library file after compilation.

5. Create a Shared Library (`libadc.so`) to create a shared library, use the following `gcc` command:

    ```sh
    $ gcc -shared -o libadc.so adc.o
    ```

    - **Command Breakdown:**
      - `-shared`: Tells gcc to produce a shared library.
      - `-o libadc.so`: Specifies the output filename for the shared library.
      - `adc.o`: The object file to be included in the library.

    >> **Explanation: What is a Shared Library?**
    >>
    >>A shared library, on the other hand, is not linked into the final executable at compile time. Instead, it is loaded into memory at runtime. Multiple programs can share a single copy of a shared library, which can save memory and allow updates to the library without recompiling the programs that use it.

6. Install the Header and Library Files System-Wide. You could manually copy the header file to `/usr/include` and the libraries to `/usr/lib`, or skip to the next section and create a `Makefile` to do it for you each time.

    ```sh
    $ sudo cp adc.h /usr/include/
    $ sudo cp libadc.a /usr/lib/
    $ sudo cp libadc.so /usr/lib/
    $ sudo ldconfig  # Update the shared library cache
    ```
7. We can do this using a Makefile aswell, edit the `Makefile`:
    <details>
    <summary>Suppressed code here [43 lines]...</summary>

    ```makefile
    # Variables
    CC = gcc
    CFLAGS = -Wall -Werror -fPIC  # -fPIC is needed for shared libraries
    AR = ar
    ARFLAGS = rcs
    TARGET_STATIC = libadc.a
    TARGET_SHARED = libadc.so
    OBJ = adc.o

    # Default target: Build both libraries
    all: $(TARGET_STATIC) $(TARGET_SHARED)

    # Compile the adc.c into an object file
    $(OBJ): adc.c
            $(CC) $(CFLAGS) -c adc.c -o $(OBJ)

    # Create the static library
    $(TARGET_STATIC): $(OBJ)
            $(AR) $(ARFLAGS) $(TARGET_STATIC) $(OBJ)

    # Create the shared library
    $(TARGET_SHARED): $(OBJ)
            $(CC) -shared -o $(TARGET_SHARED) $(OBJ)

    # Clean up build artifacts
    clean:
            rm -f $(OBJ) $(TARGET_STATIC) $(TARGET_SHARED)

    # Install libraries and header
    install: $(TARGET_STATIC) $(TARGET_SHARED)
            sudo cp adc.h /usr/include/
            sudo cp $(TARGET_STATIC) /usr/lib/
            sudo cp $(TARGET_SHARED) /usr/lib/
            sudo ldconfig

    # Uninstall libraries and header
    uninstall:
            sudo rm -f /usr/include/adc.h
            sudo rm -f /usr/lib/$(TARGET_STATIC)
            sudo rm -f /usr/lib/$(TARGET_SHARED)
            sudo ldconfig

    # Phony targets
    .PHONY: all clean install uninstall
    ```

8. As long as the Makefile is within directory with the custom adc c files you can use the `make` command:
   
   -  Remove `adc.h`, and static and share libraries from the respective directories

        ```sh
        $ make uninstall
        ```

   - To clean up the build artefacts run: 
    
        ```sh
        $ make clean
        ```
   - To build the libraries and object files:

        ```sh
        $ make all
        ```

   - Lastly, use the install command to `cp` libraries and header to respective root directories:

        ```sh
        $ make install
        > gcc -Wall -Werror -fPIC   -c adc.c -o adc.o
          ar rcs libadc.a adc.o
          gcc -shared -o libadco.so adc.o
        ```
## 7: Using the our new libary to control a pin

9. Change directory and `../` and make a new directory called `adc_read` and navigate into it.
    
    ```sh
    $ cd ../
    $ mkdir adc_read
    $ cd adc_read
    ```

10. Create a new .c file called... `adc_read.c` and chose your preferred editor to open it.
    ```sh
    $ touch adc_read.c
    $ vim adc_read.c
    ```

11. Now we are going to set up the program to use our system wide library and header with `adc.h`:
    
    <details>
    <summary>Suppressed code here [17 lines]...</summary>

    ```c
    #include "adc.h"
    #include <stdio.h>
    #include <unistd.h>

    int main(){
        unsigned int i = 0;
        unsigned int adc_reading = 0;
        while(i < 30){

            adc_get_value(0, &adc_reading);

            printf("ADC: %u\n ",adc_reading);
            sleep(1);

        }
        return 0;
    }
    ```
    </details>

12. We can use this oneliner to compile the code:

    ```sh
    $ gcc 
    ```

13. Alternatively we can use a `Makefile` like before:
    ```makefile
    # Compiler and flags
    CC = gcc
    CFLAGS = -Wall -Werror

    # Target executable name
    TARGET = adc_read

    # Source files
    SRC = adc_read.c

    # Library to link against
    LIBS = -ladc

    # Default target: build the executable
    all: $(TARGET)

    # Build the executable
    $(TARGET): $(SRC)
            $(CC) $(CFLAGS) $(SRC) $(LIBS) -o $(TARGET)

    # Clean up build artifacts
    clean:
            rm -f $(TARGET)

    # Phony targets to avoid conflicts with files of the same name
    .PHONY: all clean
    ```
    
    Invoke make to build the executable:

    ```sh
    $ make
    ```
14. Use the led and etc to wire up and run the code:

    ```sh
    $ ./adc_read
    ```

    - If all is well, and you have connected up your potentiometer to the correct pin, and you rotate it you should see the following output:

        ```
        ADC: 4019
        ADC: 4018
        ADC: 4018
        ADC: 3634
        ADC: 2991
        ADC: 2713
        ADC: 2442
        ADC: 2256
        ADC: 2028
        ADC: 1833
        ADC: 1604
        ADC: 1334
        ADC: 1149
        ADC: 1199
        ADC: 1095
        ADC: 681
        ADC: 410
        ... # upto 30 times
        ```

15.  Extra: Continuous Sampling with Buffering

        Consider making use of the buffer in `/sys/bus/iio/devices/iio\:device0/buffer/` which has the following:

        ```
        data_available  enable          length          watermark
        ```

        - **Functionality**: Enable continuous sampling mode using buffers and interrupts.
        
        - **Purpose**: For applications requiring high-speed sampling or real-time data monitoring, like audio signal processing or monitoring fast-changing sensors.
        
        - **How to Implement**:
            - Set up a circular buffer in the kernel space to store ADC samples.
            - Use interrupts or polling to read data from the buffer when new samples are available.
            - Implement callback functions to handle the buffered data.

        **Example Prototypes:**
        ```h
        int adc_start_continuous_sampling(unsigned int channel, size_t buffer_size);
        void adc_stop_continuous_sampling(void);
        void adc_register_callback(void (*callback)(unsigned int value));
        ```