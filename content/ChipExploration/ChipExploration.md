# Exploring the Chips

<!--
https://www.manualslib.com/manual/2120132/Texas-Instruments-Am335-Series.html?page=158#manual
-->

## Understanding the `/sys/bus/i2c/devices/` Directory on the BeagleBoard

The BeagleBoard, like other Linux-based embedded systems, utilizes the sysfs interface to provide a standardized way to interact with hardware components, such as I2C devices. The directory `/sys/bus/i2c/devices/` is specifically related to the I2C (Inter-Integrated Circuit) bus, which is commonly used for connecting low-speed peripherals to the main board's processor.

### 1. What is I2C?

I2C is a synchronous, multi-master, multi-slave, packet-switched, single-ended, serial communication bus. It's widely used for attaching lower-speed peripheral ICs to processors and microcontrollers in short-distance, intra-board communication.

### 2. Structure of `/sys/bus/i2c/devices/`

The `/sys/bus/i2c/devices/` directory in Linux contains a list of all the I2C devices currently recognized by the system. This directory is dynamically populated by the kernel when it detects devices on the I2C buses.

Each entry in this directory follows a naming convention based on the bus number and the device address:

~~~admonish terminal

```
i2c-<bus number>-<device address>
```
~~~

~~~admonish example

```
i2c-1-0050
```

- **`i2c-1`**: This indicates the I2C bus number (`1` in this case).
- **`0050`**: This is the hexadecimal address of the device on the I2C bus (`0x50`).

~~~



### 3. Interacting with I2C Devices

To interact with I2C devices through `/sys/bus/i2c/devices/`, you need to understand the basic components provided in this directory for each device.

#### Example Structure for an I2C Device

Within each device directory (e.g., `/sys/bus/i2c/devices/i2c-1-0050/`), you'll find several files and subdirectories, such as:

- **`name`**: This file contains the name of the I2C device.
- **`modalias`**: This file contains the modalias of the device, used by the kernel to load the appropriate driver.
- **`subsystem`**: This symlink points to the subsystem (`i2c` in this case) under which this device is categorized.
- **`uevent`**: This file contains attributes that the kernel sends to `udev` when the device is added or removed.
- **`driver`**: A symlink to the device's driver if it's bound to one.
- **`power`**: A directory that contains power management information for the device.

### 4. Common Tasks

1. **Listing I2C Devices**:  
   You can list all I2C devices connected to the BeagleBoard using the following command:

   ~~~admonish terminal
   ```bash
   ls /sys/bus/i2c/devices/
   ```
   ~~~

   This command will output all detected I2C devices with their respective bus numbers and addresses.

2. **Interpreting the I2C Devices Listed in `/sys/bus/i2c/devices/` on the BeagleBoard**

    You ran the following command to list all I2C devices on the BeagleBoard:
    
    ~~~admonish output
    
    ```sh
    $ tail -v -n +1 /sys/bus/i2c/devices/*/name
    ==> /sys/bus/i2c/devices/0-0024/name <==
    tps65217

    ==> /sys/bus/i2c/devices/0-0034/name <==
    tda9950

    ==> /sys/bus/i2c/devices/0-0050/name <==
    24c256

    ==> /sys/bus/i2c/devices/0-0070/name <==
    tda998x

    ==> /sys/bus/i2c/devices/2-0054/name <==
    24c256

    ==> /sys/bus/i2c/devices/2-0055/name <==
    24c256

    ==> /sys/bus/i2c/devices/2-0056/name <==
    24c256

    ==> /sys/bus/i2c/devices/2-0057/name <==
    24c256

    ==> /sys/bus/i2c/devices/i2c-0/name <==
    OMAP I2C adapter

    ==> /sys/bus/i2c/devices/i2c-1/name <==
    OMAP I2C adapter

    ==> /sys/bus/i2c/devices/i2c-2/name <==
    OMAP I2C adapter
    ```
   ~~~

 - **Explanation of Each Device:**

      Below is the breakdown of each entry in the output:

      1. **`/sys/bus/i2c/devices/0-0024/name`**
         - **Device Address**: `0x24` (hexadecimal)
         - **Bus Number**: `0`
         - **Device Name**: `tps65217`
         - **Description**: The [`tps65217`](https://www.ti.com/product/TPS65217) is a power management IC commonly used on BeagleBoards to manage power supplies.

      2. **`/sys/bus/i2c/devices/0-0034/name`**
         - **Device Address**: `0x34` (hexadecimal)
         - **Bus Number**: `0`
         - **Device Name**: `tda9950`
         - **Description**: The [`tda9950`](https://www.digikey.co.uk/en/htmldatasheets/production/667036/0/0/1/tda9950) is an HDMI CEC (Consumer Electronics Control) controller, often used in devices that support HDMI connections.

      3. **`/sys/bus/i2c/devices/0-0050/name`**
         - **Device Address**: `0x50` (hexadecimal)
         - **Bus Number**: `0`
         - **Device Name**: `24c256`
         - **Description**: []`24c256`](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-8568-SEEPROM-AT24C256C-Datasheet.pdf) refers to an EEPROM (Electrically Erasable Programmable Read-Only Memory) chip with a capacity of 256 kilobits, often used for storing configuration data.

      4. **`/sys/bus/i2c/devices/0-0070/name`**
         - **Device Address**: `0x70` (hexadecimal)
         - **Bus Number**: `0`
         - **Device Name**: `tda998x`
         - **Description**: [`tda998x`](https://media.digikey.com/pdf/Data%20Sheets/NXP%20PDFs/TDA9981B.pdf) is an HDMI transmitter controller used to convert video signals for HDMI output.

      5. **`/sys/bus/i2c/devices/2-0054/name`** to **`/sys/bus/i2c/devices/2-0057/name`**
         - **Device Addresses**: `0x54`, `0x55`, `0x56`, `0x57` (hexadecimal)
         - **Bus Number**: `2`
         - **Device Name**: [`24c256`](https://www.microchip.com/en-us/product/AT24C256C)
         - **Description**: These are additional EEPROM chips, possibly different banks or sections of memory, all sharing the same I2C bus but with different addresses.

      6. **`/sys/bus/i2c/devices/i2c-0/name`**, **`/sys/bus/i2c/devices/i2c-1/name`**, **`/sys/bus/i2c/devices/i2c-2/name`**
         - **Device Names**: `OMAP I2C adapter`
         - **Description**: These entries represent the I2C bus adapters themselves, not specific I2C devices. [`OMAP I2C adapter`](https://www.ti.com/lit/ug/sprufl9d/sprufl9d.pdf?ts=1725372142895) refers to the I2C controller on the OMAP processor used in BeagleBoard systems. There are three separate I2C buses (`i2c-0`, `i2c-1`, and `i2c-2`).

### 5. Next Steps

1. **Computer says no...**

   You want to read the registers of the `tps65217` power management IC on your BeagleBoard using `i2cdump`. However, you may encounter the error:

   ~~~admonish error
   ```
   $ i2cdump -y 0 0x24 
   > Error: Could not set address to 0x24: Device or resource busy
   ```

   This error occurs because the device is currently in use by another process, typically a kernel driver. The steps below will guide you through unbinding the driver, using i2cdump to read the registers, interpreting the data, and rebinding the drive

   ~~~

2. **Check for Loaded Drivers**
   First, verify that the kernel driver managing the `tps65217` device is loaded. Run the following command:

   ~~~admonish terminal

   ```bash
   $ ls /sys/bus/i2c/drivers/tps65217
   > 0-0024/ bind    uevent  unbind
   ```
   You should see an entry like 0-0024 (indicating bus 0 and address 0x24).
   ~~~

   Unbind the device by echoing the bus and address to the unbind file:

   ~~~admonish terminal
   ```sh
   $ echo "0-0024" > /sys/bus/i2c/drivers/tps65217/unbind
   ```
   ~~~

3. **Using i2cdump to Read the Registers**

   After unbinding, you can use i2cdump to read the registers.

   Run `i2cdump`:

   ~~~admonish terminal
   ```sh
   i2cdump -y 0 0x24 b
   ```
   ~~~

   This command will provide a hex dump of all the registers in the `tps65217` device in byte (`b`) format.

   ~~~admonish output collapsible=true title='Suppressed Output'

   ```sh
      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f      0123456789abcdef
   00: e2 3f 20 01 b1 80 b2 01 00 00 84 00 7f 0c 18 11    ?? ?????..?.????
   10: 08 06 09 38 26 3f 7f 00 03 15 5f 32 40 20 00 00    ???8&??.??_2@ ..
   20: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   30: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   40: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   50: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   60: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   70: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   90: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   a0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   b0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   c0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   d0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   e0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   f0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00    ................
   ```
   ~~~

4. **Explaining the `i2cdump` Output**

   The i2cdump output shows the register values of the `tps65217` device. Let's interpret the first few lines:

   - `0x00` to `0x0F`: General configuration and status registers.
      - `0x00 (e2)`: A possible configuration register controlling power settings.
      - `0x01 (3f)`: Might be a status register indicating the current state or fault conditions.
      - `0x02 (20)`: Another configuration register, potentially for voltage control.

   - `0x10 to 0x1F`: Power management settings for different regulators.
      - `0x10 (08)`: Regulator voltage setting or enable/disable control.
      - `0x11 (06)`: Another voltage setting or related control register.

   - `0x20` and beyond: Reserved or additional configuration registers.
      - Registers from 0x20 onwards are all 00, indicating they might not be used or are set to a default value.

   For detailed interpretation, refer to the [`tps65217`](https://www.ti.com/product/TPS65217) datasheet.

### 6. Rebinding the Driver

After you have finished using `i2cdump`, you should rebind the driver to ensure the device continues to function correctly under kernel management.

**Steps to Rebind:**
1. Rebind the Device:
   - Rebind the driver by echoing the bus and address to the `bind` file:

      ~~~admonish terminal

      ```sh
      echo "0-0024" > /sys/bus/i2c/drivers/tps65217/bind
      ```

      ~~~

2. **Verify the Binding:**
   - Verify that the driver is correctly bound again

      ~~~admonish terminal

      ```sh
      ls /sys/bus/i2c/drivers/tps65217/
      ```

      ~~~

   You should see `0-0024` listed again.

   ~~~admonish warning
   
   Unbinding and rebinding drivers on a BeagleBoard can cause system instability, data loss, or hardware damage. Unbinding stops the driver from managing the device, which might disrupt critical functions or leave devices in unsafe states. It exposes devices for direct user access, which could lead to incorrect configurations or security risks. Always ensure you understand the device and driver, back up data, and have a recovery plan. Rebind drivers promptly after use to restore normal operations.
   
   ~~~

### 9. Explore!

Get a dump from the other I2C devices on your BeagleBoard, you can use the `i2cdump` command similarly to how you did with the `tps65217` device. Below are the steps for each device listed in your output:

   1. **Identifying Other I2C Devices**
   
      From your previous output, you have several I2C devices on different buses. Here is a list of devices we can check:

      - Bus 0:
         - `0x34` - `tda9950` (HDMI CEC controller)
         - `0x50` - `24c256` (EEPROM)
         - `0x70` - `tda998x` (HDMI transmitter)
      
      - Bus 2:
         - `0x54` to `0x57` - `24c256` (EEPROMs)

   2. Remember the i2cdump command will only work if you unbind each driver.

   3. Use the documentation for each chip to understand the output produced.

### 8. Summary

~~~admonish tldr

The `/sys/bus/i2c/devices/` directory on the BeagleBoard provides a powerful interface for managing and interacting with I2C devices. By understanding the structure of this directory and the available commands, you can effectively control I2C peripherals, whether they are sensors, EEPROMs, or other types of devices. This guide has provided the foundational knowledge and practical examples needed to start working with I2C devices on your BeagleBoard.

~~~
