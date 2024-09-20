# Nix Package Manager on Ubuntu or Debian

Even though Ubuntu/Debian is equipped with its legendary powerful package manager, dpkg, in some cases, it is still beneficial to take advantage of [Nix](https://nixos.org/nix), a purely functional package manager.

The [complete manual](https://nixos.org/nix/manual) of Nix does a fantastic job on explaining how to install and use it. But for the impatients among you, here is a quick overview. Note that this also works well when using Ubuntu/Debian under WSL ([Windows Subsystem for Linux](https://ubuntu.com/wsl)), both the original and the newest WSL 2.

1. First, create the /nix directory owned by you (this is the common [single-user installation](https://nixos.org/nix/manual/#sect-single-user-installation)):

    ```sh
    $ sudo mkdir /nix
    $ sudo chown <user> /nix
    ```
    > **Note:**
    >> `<user>` is your current user on your system.

2. And then, run the installation script:

    ```sh
    $ sh <(curl -L https://nixos.org/nix/install) --no-daemon
    ```
    >**Note:** 
    >> That if you use WSL 1, likely you will encounter some error such as:
    >> `SQLite database '/nix/var/nix/db/db.sqlite' is busy`
    >> This a known [issue](https://github.com/NixOS/nix/issues/2651), the workaround is to create a new file `~/.config/nix/nix.conf` with the following content:
    >>   ```sh
    >>   sandbox = false
    >>   use-sqlite-wal = false
    >>   ```
    >> and then repeat beginning of step 2.

    If nothing goes wrong, the script will perform the installation. Grab a cup of tea while waiting for it!

    ```sh
    downloading Nix 2.3.4 binary tarball for x86_64-linux
    performing a single-user installation of Nix...
    copying Nix to /nix/store......................................
    replacing old 'nix-2.3.4'
    installing 'nix-2.3.4'
    unpacking channels...
    ```

3. Note that the last step (unpacking channels) can run for a very long time. Just be patient.

    To check whether Nix is successfully installed, we use the Hello, world tradition:

    ```sh
    $ nix-env -i hello
    installing 'hello-2.10'
    these paths will be fetched (6.62 MiB download, 31.61 MiB unpacked):
    /nix/store/9l6d9k9f0i9pnkfjkvsm7xicpzn4cv2c-libidn2-2.3.0
    /nix/store/df15mgn0zsm6za1bkrbjd7ax1f75ycgf-hello-2.10
    /nix/store/nwsn18fysga1n5s0bj4jp4wfwvlbx8b1-glibc-2.30
    /nix/store/pgj5vsdly7n4rc8jax3x3sill06l44qp-libunistring-0.9.10
    $ which hello
    /home/ariya/.nix-profile/bin/hello
    $ hello
    Hello, world!
    ```
    >**Note:**
    >> You will see different hashing in your file path, this is normal.

    In the above illustration, `hello` is a test package that does nothing but to display the famous message. It looks simple, and yet it is very useful!

    To get the feeling of packages available at your disposal (almost +30 thousand of them)

    ```sh
    $ nix-env -qa  > nix-packages.list
    $ wc -l nix-packages.list
    57627 nix-packages.list
    $ less nix-package.list
    ```

> **NOTE:**
>> - To leave any interactive package, press `q` or type `exit` or press the escape key

## Using Isolated Development Environments in Nix

Ensure you have followed the above steps in the previous section.

```sh
$ nix-env -qs
IPS  nix-1.11.2
IPS  nss-cacert-3.21
```
For example, on my instance I get:

```sh
$ nix-env -qs
IPS  calc-2.13.0.1
IPS  check-uptime-20161112
IPS  git-with-svn-2.33.1
IPS  gt5-1.4.0
IPS  hello-2.12.1
IP-  home-manager-path
IPS  nix-prefetch-github-4.0.4
IPS  qtgraphicaleffects-5.15.3
IPS  qtmultimedia-5.15.3
IPS  unzip-6.0
IPS  xbacklight-1.2.3
IPS  xev-1.2.4
IPS  xmodmap-1.0.10
IPS  zip-3.0
```

Lets say we need to work on a project named **Finch**. This is a stable project, it is running in production, it relies on a set of solid and proven environments: `Go 1.4`, `PUC-Lua 5.3`, and `Python 2.7`.

On the other hand, we also have another unrelated project, **Grove**. With this project, we are still experimenting and thus we want to use the latest cutting-edge technology. Its stack is based on the latest `Python 3.5` and `Go 1.6`. For other reasons, we also needed a faster Lua and thereby we pick `LuaJIT`. As a version control, `Fossil` is chosen instead of `Git`.

For the first project, we need to setup the following in `~/projects/finch/default.nix` with the following content:

```sh
$ mkdir -p ~/projects/finch/ && vim ~/projects/finch/default.nix
```

```nix
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    python
    python27Packages.virtualenv
    python27Packages.pip
    go_1_4
    lua5_3
  ];
}
```

Without going into Nix expression (refer to [the manual](https://nixos.org/nixpkgs/manual/) for the details), the above file tells Nix to build a new environment with the given list of packages specified by the package’s attribute path, listed as `buildInputs`. How do I know the attribute path for e.g. Go 1.4? One way is to list all available packages:


```sh
$ nix-env -qaP | grep 'go-1.4'
nixpkgs.go_1_4             go-1.4.3
```

In the above example go_1_4 (or the fully qualified path nixpkgs.go_1_4) is the attribute path for our lovely go-1.4.3 package.

Once this Nix file is ready, every time we want to work on **Finch**, all we have to do is:
```sh
$ cd ~/projects/finch/
$ nix-shell
[nix-shell:~/projects/finch]$
```

This will start a new shell with all the packages specified in `default.nix`. That is, I’m going to get the exact specified version of Python, Go, and Lua. If this is done for the first time, Nix needs to install or build those packages but subsequent call to `nix-shell` will be very fast since it is reusing what is in the cache.

To verify that this is working:

```sh
[nix-shell:~/projects/finch]$ python --version
Python 2.7.11
[nix-shell:~/projects/finch]$ pip --version
pip 8.1.2 from /nix/store/3cag9i2pa52qjxq5yvjap6m7jvp6idqm-python2.7-pip-8.1.2/lib/python2.7/site-packages (python 2.7)
[nix-shell:~/projects/finch]$ go version
go version go1.4.3 darwin/amd64
[nix-shell:~/projects/finch]$ lua -v
Lua 5.3.0  Copyright (C) 1994-2015 Lua.org, PUC-Rio
```

This is a completely *sealed* development environment to work on the **Finch** project. We can use `Python`, including virtualenv and `pip`, as expected:

```sh
[nix-shell:~/projects/finch]$ virtualenv env
New python executable in env/bin/python2.7
Also creating executable in env/bin/python
Installing setuptools, pip, wheel...done.
[nix-shell:~/projects/finch]$ source env/bin/activate
(env)
[nix-shell:~/projects/finch]$ pip install simplejson
Collecting simplejson
Installing collected packages: simplejson
Successfully installed simplejson-3.8.2
(env)
[nix-shell:~/projects/finch]$ pip list
pip (8.1.2)
setuptools (19.4)
simplejson (3.8.2)
virtualenv (13.1.2)
wheel (0.24.0)
(env)
```

If we exit the shell, we are back to the default environment which may not have all the specified packages at all.

```sh
[nix-shell:~/projects/finch]$ exit
dev:~/projects/finch $ go version
-bash: go: command not found
dev:~/projects/finch $ pip --version
-bash: pip: command not found
```

![]() SOME SCREENSHOT SHOWING THIS

Now we are switching to **Grove**. Its `default.nix` looks slightly different:

Setup the following in `~/projects/grove/default.nix` with the following content:

```sh
$ mkdir -p ~/projects/grove/ && nano ~/projects/grove/default.nix
```

```nix
with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    python35
    python35Packages.virtualenv
    python35Packages.pip
    luajit
    fossil
  ];
}
```

Now change directory and launch the shell:

```sh
$ cd ~/projects/grove/
$ nix-shell
[nix-shell:~/projects/grove]$
```

And it’s easy to see what I get within this environment:

```sh
nix-shell:~/projects/grove]$ fossil version
This is fossil version 1.33 [9c65b5432e] 2015-05-23 11:11:31 UTC
[nix-shell:~/projects/grove]$ lua -v
LuaJIT 2.1.0-beta1 -- Copyright (C) 2005-2015 Mike Pall. http://luajit.org/
[nix-shell:~/projects/grove]$ virtualenv env
New python executable in env/bin/python3.5m
Also creating executable in env/bin/python
Installing setuptools, pip, wheel...done.
[nix-shell:~/projects/grove]$ source env/bin/activate
(env)
[nix-shell:~/projects/grove]$ pip list
pip (7.1.2)
setuptools (19.4)
virtualenv (13.1.2)
wheel (0.24.0)
(env)
```

As you can see, we keep our global environment as clean as possible and at the same time, we have the flexible working environment for our two (or more) different projects. The necessary dependent packages of one project will not interfere or pollute other projects, even if it is the same package with different versions (Python 2.7 vs Python 3.5, Go 1.4 vs Go 1.6, PUC-Lua 5.3 vs Lua-JIT 2.1).