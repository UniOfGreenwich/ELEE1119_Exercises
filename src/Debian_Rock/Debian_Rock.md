# Introduction

This page will give useful information for navigating the Debian OS on the Rock C4+.

## Getting Started

Once you have managed to get into the Debain OS on the Rock C+, you will need to do a couple of steps to get the OS ready.

1. `sudo apt update`
    - This should update the system however you may get a response that says:
    ```sh
    > W: An error occured during the signature verifcation. The repository is not updated and the previous index files will be used. GPG error: http://apt.radxa/com/bullseye-stable bullseye InRelease: The following signatures could not be verified because the public key is not available: NO_PUBKEY 9B98116C9AA302C7
    > W: Filed to fetch http://apt.radxa/com/bullseye-stable/dists/bullseye/InRelease The following signatures could not be verified because the public key is not available: NO_PUBKEY 9B98116C9AA302C7
    > W: Some index files failed to download. They have been ignored, or old ones used instead.
    ```
    -  If that is the case you will need to run the following command:
    ```sh
    $ wget -O - apt.radxa.com/focal-stable/public.key | sudo apt-key add
    ```

    - You should get some feedback with a HTTP request and a Warning about apt-key is deprecated... this is fine (if only there was a deterministic, declarative system out there we could have used...)

    - Run the `sudo apt update` again and once finished run `sudo apt upgrade` this my take 10 mins.

    Source: [https://wiki.radxa.com/Rock5/linux/radxa-apt#focal-stable](https://wiki.radxa.com/Rock5/linux/radxa-apt#focal-stable)

## Networking

The Debain OS for the Rock C4+ uses the `NetworkManager` package to manage all connections to the network interface chips. 

`NetworkManager` directory is located here -> `/etc/NetworkManager`, the contents of which is:

```sh
NetworkManager.conf
conf.d/
dispatcher.d/
dnsmasq-shared.d/
dnsmasq.d/
system-connections/
```

All of your Wi-Fi profiles are stored in the `system-connections` folder, for example:

```sh
$ ls /etc/NetworkManager/system-connections
> OKdo05.nmconnection
> eduroam.nmconnection
```

> **Note:**
>> The file naming convention, `<ssid>.nmconnection`, this is strict and case-sensitive.

Each `...nmconnection` file has a format and for eduroam, which is an enterprise network it looks like this, you will need to have root level permissions:

```sh
$ sudo cat /etc/NetworkManager/system-connections/eduroam.nmconnection
```
**Output:**
```sh
[connection]
id=eduroam
uuid=4e3235f7-8387-4102-8a57-dd1120f29ac5
type=wifi
interface-name=wlan0
permissions=user:dev:;

[wifi]
mac-address-blacklist=
mode=infrastructure
ssid=eduroam

[wifi-security]
auth-alg=open
key-mmgt=wpa-eap

[802-1x]
anonymous-identity=username@gre.ac.uk
eap=ttls;
identity=username@greenwich.ac.uk
password=YOURPASSWORD
phase2-auth=mschapv2

[ipv4]
dns-search=
method=auto

[ipv6]
addr-gen-mode=stable-privacy
dns-search=
method=auto

[proxy]
```

> **Note** 
>> You may need to reload the connection:
>> - `nmcli connection reload` or you can do this with elevation
>> - `sudo ncmli connetion reload`
