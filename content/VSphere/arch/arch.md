# Arch for RPI

First thing to note, Arch Linux **doesn’t** support **ARM architecture** (used by devices like Raspberry Pi) officially. But there is a separate project called **Arch Linux ARM** that ports Arch Linux to ARM devices. It is available in both 32-bit & 64-bit format.

Since the installation procedure is purely terminal-based, you will develop an itermediate knowledge of the Linux command line and you should be comfortable in using terminal! 

## Download and extract Arch Linux for Raspberry Pi 4

### Arch[64,32]
#### Arch64
Make sure that you have root access (otherwise the process may fail), and run the following commands (with `sudo`, if you are not `root`).

```shell
$ wget http://os.archlinuxarm.org/os/ArchLinuxARM-rpi-aarch64-latest.tar.gz
$ tar -xzvf ArchLinuxARM-rpi-aarch64-latest.tar.gz
```
Or...

#### Arch32
Make sure that you have root access (otherwise the process may fail), and run the following commands (with `sudo`, if you are not `root`).

```shell
$ wget http://os.archlinuxarm.org/os/ArchLinuxARM-rpi-4-latest.tar.gz
$ tar -xzvf ArchLinuxARM-rpi-aarch64-latest.tar.gz
```