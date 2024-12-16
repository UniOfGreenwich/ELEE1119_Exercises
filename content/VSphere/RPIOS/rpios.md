# Raspberry Pi OS

## Changing Major Release

Repository 'http://raspbian.raspberrypi.org/raspbian `buster InRelease`' changed its 'Suite' value from 'stable' to 'oldstable'

As RPI OS follows Debian and Debian has moved on to `bullseye` that has now be come the `InRelease stable`, and `buster` has been relegated to "`oldstable`".

If you run `sudo apt update` which is the recommend way of updating the repositories you will have the option to accept the changes or it may just do it automatically.

As it appears to have done here

```sh
> $ sudo apt-get update
Get:1 http://raspbian.raspberrypi.org/raspbian buster InRelease [15.0 kB]
Get:2 http://archive.raspberrypi.org/debian buster InRelease [32.6 kB]
Get:3 http://raspbian.raspberrypi.org/raspbian buster/main armhf Packages [13.0 MB]
Get:4 http://archive.raspberrypi.org/debian buster/main armhf Packages [378 kB]
Fetched 13.4 MB in 13s (1,011 kB/s)
Reading package lists... Done
N: Repository 'http://raspbian.raspberrypi.org/raspbian buster InRelease' changed its 'Suite' value from 'stable' to 'oldstable'
```

or
```sh
>  sudo apt update
Hit:1 http://raspbian.raspberrypi.org/raspbian buster InRelease
Hit:2 http://archive.raspberrypi.org/debian buster InRelease
Reading package lists... Done
Building dependency tree
Reading state information... Done
24 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

or do the following, tt is a little more unsecure but is okay for us. 

```sh
$ sudo apt-get --allow-releaseinfo-change update
```

## Holding Packagings using `apt`

**Hold a package:**

```sh 
$ sudo apt-mark hold <package-name>
```

**Remove the hold:**
```sh
$ sudo apt-mark unhold <package-name>
```

**Show all packages on hold:**

```sh
$ sudo apt-mark showhold
```
