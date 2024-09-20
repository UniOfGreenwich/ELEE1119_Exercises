
# USB-to-Ethernet Packet Sniffing Lab

## Objective

In this lab, you will learn how to capture raw Ethernet frames transmitted via a USB-to-Ethernet adapter on a BeagleBoard. The lab will guide you through the steps of setting up a custom packet sniffer using Python to capture and analyze network traffic at the Ethernet layer.

### Prerequisites

- A BeagleBoard or similar single-board computer with a USB-to-Ethernet adapter (e.g., `smsc95xx` driver).
- Basic knowledge of networking concepts, including Ethernet frames, IP packets, and MAC addresses.
- Familiarity with Python programming, if not time to learn to swim :).
- Administrative access to the BeagleBoard for running scripts with root privileges.

## Overview

In this lab, you will:

1. Set up a BeagleBoard to use a USB-to-Ethernet adapter.
2. Write a Python script to capture raw Ethernet frames from the USB interface.
3. Analyze the captured data to understand Ethernet frame structure and IP packet contents.

## Step-by-Step Instructions

### Step 1: Set Up the BeagleBoard and USB-to-Ethernet Adapter

1. **Connect the USB-to-Ethernet Adapter**:

   - Ensure the USB-to-Ethernet adapter is connected to the BeagleBoard’s USB port.
   - Verify that the device is recognized by running `lsusb` and `ifconfig`. Look for a network interface like `usb0` or `usb1`.

   ```bash
   $ lsusb
   > Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
   ```
   ```
   $ ifconfig
   ```
   <details>
   <summary>output suppressed:...</summary>

   ```bash 
   eth0: flags=-28669<UP,BROADCAST,MULTICAST,DYNAMIC>  mtu 1500
        ether 08:04:b4:96:9e:cd  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        device interrupt 55

   lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 896492  bytes 60066960 (57.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 896492  bytes 60066960 (57.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

   usb0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.7.2  netmask 255.255.255.0  broadcast 192.168.7.255
        inet6 fe80::a04:b4ff:fe96:9ecf  prefixlen 64  scopeid 0x20<link>
        ether 08:04:b4:96:9e:cf  txqueuelen 1000  (Ethernet)
        RX packets 21471  bytes 2485427 (2.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 13715  bytes 3046408 (2.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

   usb1: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.6.2  netmask 255.255.255.0  broadcast 192.168.6.255
        ether 08:04:b4:96:9e:d3  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
   ```

   </details>

   - You should see an interface named `usb0` or `usb1` in the output.

2. **Verify Network Interface Status**:

   - Check the status of the network interfaces to ensure they are up and running.

   ```bash
   $ ifconfig usb0
   > usb0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
   ...
   ```

   - Look for the `UP` flag and ensure the interface has an IP address.

### Step 2: Write a Python Packet Sniffer

1. **Create the Python Script**:

   - Open a text editor and create a new Python script named `sniffer.py`.

   ```bash
   $ mkdir pythontools && nano sniffer.py
   ```

2. **Enter the Following Code into `sniffer.py`**:

   <details>
   <summary>suppressed code here [113 lines]</summary>

   ```python
   import socket
   import struct
   import binascii

   def mac_addr(mac_bytes):
      """Convert a MAC address to a readable/printable string format."""
      return ':'.join('%02x' % b for b in mac_bytes)

   def eth_type_to_str(eth_type_bytes):
      """Convert an Ethernet type to a readable string."""
      eth_type = struct.unpack('!H', eth_type_bytes)[0]
      if eth_type == 0x0800:
         return 'IPv4'
      elif eth_type == 0x0806:
         return 'ARP'
      elif eth_type == 0x86DD:
         return 'IPv6'
      else:
         return f'Other (0x{eth_type:04x})'

   def main():
      # Create a raw socket and bind it to the interface
      sock = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(0x0003))
      sock.bind(('usb0', 0))  # Replace 'usb0' with your interface name

      print("Sniff once on usb0...")

      # Receive raw packets from the socket
      raw_packet, _ = sock.recvfrom(65535)
      print("Raw Packet:", binascii.hexlify(raw_packet))

      # Unpack Ethernet header (first 14 bytes)
      dest_mac = raw_packet[0:6]
      src_mac = raw_packet[6:12]
      eth_type_bytes = raw_packet[12:14]

      # Display Ethernet frame
      print("\nEthernet Frame:")
      print(f"  Destination MAC: {mac_addr(dest_mac)} ({binascii.hexlify(dest_mac).decode('utf-8')})")
      print(f"  Source MAC: {mac_addr(src_mac)} ({binascii.hexlify(src_mac).decode('utf-8')})")
      print(f"  Type: {eth_type_to_str(eth_type_bytes)} ({binascii.hexlify(eth_type_bytes).decode('utf-8')})")

      # Check if the packet is IPv4 (eth_type is 0x0800)
      if eth_type_to_str(eth_type_bytes) == 'IPv4':
         # Unpack IP header (next 20 bytes)
         ip_header = struct.unpack('!BBHHHBBH4s4s', raw_packet[14:34])
         version_ihl = ip_header[0]
         tos = ip_header[1]
         total_length = ip_header[2]
         identification = ip_header[3]
         flags_offset = ip_header[4]
         ttl = ip_header[5]
         protocol = ip_header[6]
         checksum = ip_header[7]
         src_ip = socket.inet_ntoa(ip_header[8])
         dest_ip = socket.inet_ntoa(ip_header[9])

         print(f"\nIPv4 Packet:")
         print(f"  Version: {version_ihl >> 4} ({(version_ihl >> 4):x}) | Header Length: {(version_ihl & 15) * 4} bytes ({version_ihl & 15})")
         print(f"  Type of Service: {tos} ({tos:02x})")
         print(f"  Total Length: {total_length} ({total_length:04x})")
         print(f"  Identification: {identification} ({identification:04x})")
         print(f"  Flags/Fragment Offset: {flags_offset} ({flags_offset:04x})")
         print(f"  Time to Live (TTL): {ttl} ({ttl:02x})")
         print(f"  Protocol: {protocol} ({protocol:02x}) (TCP)")
         print(f"  Header Checksum: {checksum:04x}")
         print(f"  Source IP Address: {src_ip} ({binascii.hexlify(ip_header[8]).decode('utf-8')})")
         print(f"  Destination IP Address: {dest_ip} ({binascii.hexlify(ip_header[9]).decode('utf-8')})")

         # Check if the packet is TCP (protocol is 6)
         if protocol == 6:
               # Unpack TCP header (next 20 bytes after the IP header)
               tcp_header = struct.unpack('!HHLLHHHH', raw_packet[34:54])
               src_port = tcp_header[0]
               dest_port = tcp_header[1]
               seq_num = tcp_header[2]
               ack_num = tcp_header[3]
               data_offset_flags = tcp_header[4]
               window = tcp_header[5]
               tcp_checksum = tcp_header[6]
               urg_ptr = tcp_header[7]

               print(f"\nTCP Segment:")
               print(f"  Source Port: {src_port} ({src_port:04x})")
               print(f"  Destination Port: {dest_port} ({dest_port:04x})")
               print(f"  Sequence Number: {seq_num} ({seq_num:08x})")
               print(f"  Acknowledgment Number: {ack_num} ({ack_num:08x})")
               print(f"  Data Offset/Reserved/Flags: {data_offset_flags:04x}")
               print(f"  Window Size: {window} ({window:04x})")
               print(f"  Checksum: {tcp_checksum:04x}")
               print(f"  Urgent Pointer: {urg_ptr} ({urg_ptr:04x})")

               # Display payload (if any)
               payload_data = raw_packet[54:]
               print("\nPayload (Data):")
               print(binascii.hexlify(payload_data).decode('utf-8'))
         else:
               print("\nNon-TCP packet captured; this script only processes TCP packets.")
      else:
         print("\nNon-IPv4 packet captured; this script only processes IPv4 packets.")

   if __name__ == "__main__":
      main()
   ```
   </details>

3. **Save and Close the File**:

   - Save the changes in `nano` by pressing `Ctrl + O`, then exit by pressing `Ctrl + X`.

### Step 3: Run the Packet Sniffer

1. **Run the Script with Root Privileges**:

   - Run the Python script using `sudo` to ensure it has the necessary permissions to capture raw packets.

   ```bash
   sudo python3 pythontools/sniffer.py
   ```

   - The script will start capturing packets and print the Ethernet frame details to the terminal.

2. **Analyze the Output**:

   - The script should display output similar to the following:

   ```plaintext
   Sniff once on usb0...
   Raw Packet:  b'0804b4969ed00804b4969ecf08004510006473fb400040063735c0a80702c
   0a807010016c7505a4d9d22d5fe79f1501803eabf160000d825a1b55d936e9dda3da8171b442
   6616c7a369768a7beb288f3432b07b3ac7a6b18a40ca190d3f4ecabffd4c3ddbda4e34d269a1
   ffef43739b5af34'

   Ethernet Frame:
      Destination MAC: 08:04:b4:96:9e:d0 (0804b4969ed0)
      Source MAC: 08:04:b4:96:9e:cf (0804b4969ecf)
      Type: IPv4 (0800)

   IPv4 Packet:
      Version: 4 (4) | Header Length: 20 bytes (5)
      Type of Service: 16 (10)
      Total Length: 100 (0064)
      Identification: 29691 (73fb)
      Flags/Fragment Offset: 16384 (4000)
      Time to Live (TTL): 64 (40)
      Protocol: 6 (06) (TCP)
      Header Checksum: 3735
      Source IP Address: 192.168.7.2 (c0a80702)
      Destination IP Address: 192.168.7.1 (c0a80701)

   TCP Segment:
      Source Port: 22 (0016)
      Destination Port: 51024 (c750)
      Sequence Number: 1515035938 (5a4d9d22)
      Acknowledgment Number: 3590224369 (d5fe79f1)
      Data Offset/Reserved/Flags: 5018
      Window Size: 1002 (03ea)
      Checksum: bf16
      Urgent Pointer: 0 (0000)

   Payload (Data):
      d825a1b55d936e9dda3da8171b4426616c7a369768a7beb288f3432b07b3ac7a6b18a40ca190d3f4ecabffd4c3ddbda4e34d269a1ffef43739b5af34   
   ```

   - This output includes the destination MAC, source MAC, Ethernet type, and the raw data payload.

### Step 4: Understand the Packet Structure

Let’s break down the raw data to understand the components:

**Ethernet Header:**
- Destination MAC (6 bytes): 08:04:b4:96:9e:d0 (0804b4969ed0)
- Source MAC (6 bytes): 08:04:b4:96:9e:cf (0804b4969ecf)
- Type (2 bytes): 0800 (IPv4)

**IPv4 Packet (starts after the Ethernet type field):**
- Version/IHL (1 byte): 45 (4 for IPv4, Header Length = 5 * 4 = 20 bytes)
- Type of Service (1 byte): 10 (16 in decimal)
- Total Length (2 bytes): 0064 (100 in decimal)
- Identification (2 bytes): 73fb (29691 in decimal)
- Flags/Fragment Offset (2 bytes): 4000 (16384 in decimal)
- Time to Live (1 byte): 40 (64 in decimal)
- Protocol (1 byte): 06 (TCP)
- Header Checksum (2 bytes): 3735
- Source IP Address (4 bytes): c0a80702 (192.168.7.2)
- Destination IP Address (4 bytes): c0a80701 (192.168.7.1)

**TCP Segment (starts after the IPv4 header):**
- Source Port (2 bytes): 0016 (22, SSH)
- Destination Port (2 bytes): c750 (51024 in decimal)
- Sequence Number (4 bytes): 5a4d9d22 (1515035938 in decimal)
- Acknowledgment Number (4 bytes): d5fe79f1 (3590224369 in decimal)
- Data Offset/Reserved/Flags (2 bytes): 5018
- Window Size (2 bytes): 03ea (1002 in decimal)
- Checksum (2 bytes): bf16
- Urgent Pointer (2 bytes): 0000

**Payload/Data:**
- d825a1b55d936e9dda3da8171b4426616c7a369768a7beb288f3432b07b3ac7a6b18a40ca190d3f4ecabffd4c3ddbda4e34d269a1ffef43739b5af34

- The rest of the data represents the TCP payload. This could be encrypted data (if using SSH) or any other protocol data encapsulated within the TCP segment.

> **Note:**
>> - Your data may look slighty different, due to the payload.

### Step 6: Additional Exercises

1. **Modify the Script to Capture Specific Protocols**:

   - Can you modify the Python script to decrypt ssh encryption

## Conclusion

By following this lab, you will gain hands-on experience in capturing and analyzing Ethernet frames using a custom Python script. Understanding the structure of Ethernet frames and how they are transmitted over USB-to-Ethernet adapters is crucial for network diagnostics and analysis.