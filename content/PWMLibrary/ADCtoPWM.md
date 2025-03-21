# ADC to PWM functionality

## Updating the PWM library 

We need to add the a new prototype to the `pwm.h` and the body to the `pwm.c` files, that converts the ADC value to a the correct PWM duty cycle against the specified period.

~~~admonish note

Remember that the Beaglebone blacks ADC chip does not use 8bit levels, i.e 0-255 like you would find on a Arduino board. It uses provides the duty cycle as % of the period.

~~~

1. Open the `pwm.h` file and modify to include the prototype below called `map`: 

    ~~~admonish code collapsible=true title='Suppressed code here [7 lines]' 

    ```h
    #ifndef PWM_H
    #define PWM_H

    ...

    unsigned int map(u_int16_t adc_value, unsigned int period_ns);

    #endif
    ```

    ~~~

2. Next we need to modify the `pwm.c` file to include the body of the previously defined prototype, place the function at the bottom of the file:

    ~~~admonish code collapsible=true title='Suppressed code here [14 lines]' 

    ```c
    ... 

    // Map ADC value to PWM duty cycle with user-specified period
    unsigned int map(u_int16_t adc_value, unsigned int period_ns) {

        if (adc_value > 4095) {
            fprintf(stderr, "ADC value out of range\n");
            return 1;
        }

        // Map ADC value (0 to 4095) to PWM duty cycle (0 to period_ns)
        unsigned int duty_cycle_ns = (adc_value * period_ns) / 4095;

        return duty_cycle_ns;
    }
    ```

    ~~~

3. Now you need to remake the library:

    ~~~admonish terminal

    ```sh
    $ make clean
    $ make uninstall
    $ make install
    ```

    ~~~

---------


## Implementing an example

4.  We are going to create a script that utlises what we did for `adc_read.c` and `pwm_test.c`, by utilising both libraries `pwm.h` and `adc.h`.

    ~~~admonish code collapsible=true title='Suppressed code here [61 lines]' 

    ```c
    #include "pwm.h"
    #include "adc.h"
    #include <stdio.h>
    #include <unistd.h>
    #include <stdint.h>

    int main() {
        PWM pwm;
        unsigned int adc_reading = 0;
        unsigned int user_defined_period_ns = 100000; // User-defined period in nanoseconds (1 ms for 1 kHz)
        unsigned int duty_cycle = 0;

        // Initialize PWM on a specified pin, for example "P8_13"
        pwm_init(&pwm, "P8_13");

        // Set initial PWM period
        pwm_set_period(&pwm, user_defined_period_ns);

        // Enable PWM output
        pwm_enable(&pwm);

        qprintf("Phy: %s\nChannel: %s\nChip: %s\nPeriod path: %s\nDuty Cycle path: %s\nEnable path: %s\nPin Mode Path: %s\nPin Mode Sate: %s\n",pwm.phy_pin,pwm.channel,pwm.chip,pwm.period_path,pwm.duty_cycle_path,pwm.enable_path,pwm.pin_mode_path, pwm.pin_mode_state);

        // Loop to read ADC values and update PWM duty cycle
        for (int i = 0; i < 30; i++) {
            adc_get_value(0, &adc_reading); // Read ADC value from channel 0
            printf("ADC Reading: %u\n", adc_reading);

            // Map the ADC reading to the PWM duty cycle and update it
            duty_cycle = map(adc_reading, user_defined_period_ns);

            pwm_set_duty_cycle(&pwm, duty_cycle);

            sleep(1); // Update every 1 second
        }

        // Disable PWM and clean up
        pwm_disable(&pwm);
        pwm_cleanup(&pwm);

        return 0;
    }
    ```
    
    ~~~

5. Remember to create a `Makefile` file:

    ~~~admonish code collapsible=true title='Suppressed code here [25 lines]' 

    ```makefile
    # Compiler and flags
    CC = gcc
    CFLAGS = -Wall -Werror

    # Target executable name
    TARGET = adc2pwm

    # Source files
    SRC = adc2pwm.c

    # Library to link against
    LIBS = -lioctrl

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

    ~~~


6.  If all is well, and you have connected up your circuity correctly, the LED should change it's brightness based on the resistance from the potentiometer, for example you may see this terminal output:

    ~~~admonish output collapsible=true 

    ```
    PWM initialized with:
    Physical Pin: P8_13
    Channel: 7
    Chip: 1
    Period path: /sys/class/pwm/pwm-7:1/period
    Duty Cycle path: /sys/class/pwm/pwm-7:1/duty_cycle
    Enable path: /sys/class/pwm/pwm-7:1/enable
    ADC Reading: 0
    ADC Reading: 0
    ADC Reading: 283
    ADC Reading: 697
    ADC Reading: 1313
    ADC Reading: 1674
    ADC Reading: 1907
    ADC Reading: 2454
    ADC Reading: 2968
    ADC Reading: 3367
    ADC Reading: 3687
    ADC Reading: 3989
    ADC Reading: 3920
    ADC Reading: 4001
    ADC Reading: 3932
    ADC Reading: 3985
    ADC Reading: 4002
    ADC Reading: 4002
    ADC Reading: 4001
    ...
    ```

    ~~~