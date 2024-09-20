# UUID Generation in Python...

All tasks will guide you to understanding how to generate various UUID types in python. Which in turn will provide a framework for developing yours in bash.

-------------

# Task 1. UUID1


```py
import time
import random

# UUIDv1 timestamp format is 100-nanoseconds since 00:00:00.00, 15 October 1582
# see RFC 4122
uuid1_epoch = 0x01b21dd213814000

def generate_uuid1():
    # get current timestamp as 100-nanoseconds since UUIDv1 epoch
    timestamp = int((time.time() * 1e7) + uuid1_epoch)

    # convert timestamp to bytes (big-endian)
    timestamp_bytes = timestamp.to_bytes(8, byteorder='big')

    # get node ID (MAC address) as a random 48-bit integer
    node_id = random.getrandbits(48)

    # convert node ID to bytes (big-endian)
    node_id_bytes = node_id.to_bytes(6, byteorder='big')

    # set UUID version and variant bits
    version_bits = (1 << 12)
    variant_bits = (1 << 62) | (1 << 63)

    # combine all parts into a single UUIDv1 (as bytes)
    uuid_bytes = timestamp_bytes[:4] + timestamp_bytes[4:6] + \
        version_bits.to_bytes(2, byteorder='big') + \
        node_id_bytes[:2] + node_id_bytes[2:6] + variant_bits.to_bytes(8, byteorder='big')

    # convert bytes to a string representation of the UUIDv1
    uuid_str = '-'.join([f'{b.hex()}' for b in (
        uuid_bytes[:4], uuid_bytes[4:6], uuid_bytes[6:8],
        uuid_bytes[8:10], uuid_bytes[10:])])

    return uuid_str

# generate and print a UUIDv1
print(generate_uuid1())

```


The code generates a UUIDv1 by first calculating the timestamp as the number of 100-nanosecond intervals since the UUIDv1 epoch (which is defined as 00:00:00.00, 15 October 1582). It then converts the timestamp to a big-endian byte array, and generates a random node ID (equivalent to the MAC address in a real implementation) as a 48-bit integer.

The code then sets the UUIDv1 version and variant bits, combines all parts into a single byte array, and converts the byte array to a string representation of the UUIDv1.

Note that this implementation does not guarantee the uniqueness of the generated UUIDs, as it uses a random node ID. In a real implementation, the node ID should be set to a unique value, such as the MAC address of the network interface.

-----------------

## Task 2. UUID 2

```py
import time

# UUIDv2 namespace for DCE Security (RFC 4122)
uuid2_namespace = b'\x6a\x8b\xbb\x60\x2c\x0c'

def generate_uuid2(identifier):
    # get current timestamp as 100-nanoseconds since UTC start
    timestamp = int((time.time() * 1e7))

    # convert timestamp to bytes (big-endian)
    timestamp_bytes = timestamp.to_bytes(8, byteorder='big')

    # convert namespace to bytes (big-endian)
    namespace_bytes = uuid2_namespace

    # convert identifier to bytes (big-endian)
    identifier_bytes = identifier.to_bytes(6, byteorder='big')

    # calculate hash of namespace and identifier
    hash_bytes = hash(namespace_bytes + identifier_bytes).to_bytes(16, byteorder='big')

    # set UUID version and variant bits
    version_bits = (2 << 12)
    variant_bits = (1 << 62) | (1 << 63)

    # combine all parts into a single UUIDv2 (as bytes)
    uuid_bytes = timestamp_bytes[:4] + timestamp_bytes[4:6] + \
        version_bits.to_bytes(2, byteorder='big') + \
        hash_bytes[:2] + hash_bytes[2:4] + \
        identifier_bytes[:2] + identifier_bytes[2:6] + variant_bits.to_bytes(8, byteorder='big')

    # convert bytes to a string representation of the UUIDv2
    uuid_str = '-'.join([f'{b.hex()}' for b in (
        uuid_bytes[:4], uuid_bytes[4:6], uuid_bytes[6:8],
        uuid_bytes[8:10], uuid_bytes[10:])])

    return uuid_str

# generate and print a UUIDv2 for an example identifier
identifier = 12345
print(generate_uuid2(identifier))

```

The code generates a UUIDv2 by first calculating the timestamp as the number of 100-nanosecond intervals since the UTC start. It then converts the timestamp to a big-endian byte array, and combines it with the UUIDv2 namespace for DCE Security and an identifier (which is a 48-bit integer in this example) to generate a 128-bit hash.

The code then sets the UUIDv2 version and variant bits, combines all parts into a single byte array, and converts the byte array to a string representation of the UUIDv2.

Note that UUIDv2 is not commonly used and may not be supported by all systems or applications. Additionally, UUIDv2 is not guaranteed to be globally unique, as it depends on the uniqueness of the identifier within the given namespace. Therefore, UUIDv4 or other algorithms may be more suitable for most use cases.

----------------

## Task 3. UUID 3

```py
import hashlib

# UUIDv3 namespace for DNS (RFC 4122)
uuid3_namespace = b'\x6b\xa7\xb8\x10\x9d\xad\x11\xd1\x80\xb4\x00\xc0\x4f\xd4\x30\xc8'

def generate_uuid3(name):
    # convert namespace to bytes
    namespace_bytes = uuid3_namespace

    # calculate hash of namespace and name
    hash_bytes = hashlib.md5(namespace_bytes + name.encode()).digest()

    # set UUID version and variant bits
    version_bits = (3 << 12)
    variant_bits = (1 << 62) | (1 << 63)

    # combine all parts into a single UUIDv3 (as bytes)
    uuid_bytes = hash_bytes[:4] + hash_bytes[4:6] + \
        version_bits.to_bytes(2, byteorder='big') + \
        hash_bytes[6:8] + name.encode() + variant_bits.to_bytes(8, byteorder='big')

    # convert bytes to a string representation of the UUIDv3
    uuid_str = '-'.join([f'{b.hex()}' for b in (
        uuid_bytes[:4], uuid_bytes[4:6], uuid_bytes[6:8],
        uuid_bytes[8:10], uuid_bytes[10:])])

    return uuid_str

# generate and print a UUIDv3 for an example name
name = 'example.com'
print(generate_uuid3(name))
```

The code generates a UUIDv3 by first calculating the MD5 hash of the UUIDv3 namespace for DNS (which is a well-known UUIDv3 namespace defined in RFC 4122) concatenated with the given name. It then sets the UUIDv3 version and variant bits, combines all parts into a single byte array, and converts the byte array to a string representation of the UUIDv3.

Note that UUIDv3 relies on the uniqueness of the given name within the specified namespace. Therefore, it is important to choose a unique and well-defined namespace and ensure that the names used to generate UUIDv3s are unique within that namespace. Alternatively, UUIDv4 or other algorithms may be more suitable for most use cases.

------

## Task 4. UUID 4

```py
import os

def generate_uuid4():
    # generate 128 random bits
    random_bytes = os.urandom(16)

    # set UUID version and variant bits
    version_bits = (4 << 12)
    variant_bits = (1 << 62) | (1 << 63)

    # combine all parts into a single UUIDv4 (as bytes)
    uuid_bytes = random_bytes[:4] + random_bytes[4:6] + \
        version_bits.to_bytes(2, byteorder='big') + \
        random_bytes[6:8] + random_bytes[8:] + \
        variant_bits.to_bytes(8, byteorder='big')

    # convert bytes to a string representation of the UUIDv4
    uuid_str = '-'.join([f'{b.hex()}' for b in (
        uuid_bytes[:4], uuid_bytes[4:6], uuid_bytes[6:8],
        uuid_bytes[8:10], uuid_bytes[10:])])

    return uuid_str

# generate and print a UUIDv4
print(generate_uuid4())

```

The code generates a UUIDv4 by generating 128 random bits using the operating system's cryptographic random number generator (os.urandom). It then sets the UUIDv4 version and variant bits, combines all parts into a single byte array, and converts the byte array to a string representation of the UUIDv4.

Note that UUIDv4 generates random UUIDs that are not guaranteed to be globally unique, but the probability of a collision is very low. Therefore, UUIDv4 is widely used for most use cases where uniqueness is required.


-----

## Task 5. UUID 5

```py
import hashlib

# UUIDv5 namespace for DNS (RFC 4122)
uuid5_namespace = b'\x6b\xa7\xb8\x10\x9d\xad\x11\xd1\x80\xb4\x00\xc0\x4f\xd4\x30\xc8'

def generate_uuid5(name):
    # convert namespace to bytes
    namespace_bytes = uuid5_namespace

    # calculate hash of namespace and name
    hash_bytes = hashlib.sha1(namespace_bytes + name.encode()).digest()

    # set UUID version and variant bits
    version_bits = (5 << 12)
    variant_bits = (1 << 62) | (1 << 63)

    # combine all parts into a single UUIDv5 (as bytes)
    uuid_bytes = hash_bytes[:4] + hash_bytes[4:6] + \
        version_bits.to_bytes(2, byteorder='big') + \
        hash_bytes[6:8] + name.encode() + variant_bits.to_bytes(8, byteorder='big')

    # convert bytes to a string representation of the UUIDv5
    uuid_str = '-'.join([f'{b.hex()}' for b in (
        uuid_bytes[:4], uuid_bytes[4:6], uuid_bytes[6:8],
        uuid_bytes[8:10], uuid_bytes[10:])])

    return uuid_str

# generate and print a UUIDv5 for an example name
name = 'example.com'
print(generate_uuid5(name))


```

The code generates a UUIDv5 by first calculating the SHA-1 hash of the UUIDv5 namespace for DNS (which is a well-known UUIDv5 namespace defined in RFC 4122) concatenated with the given name. It then sets the UUIDv5 version and variant bits, combines all parts into a single byte array, and converts the byte array to a string representation of the UUIDv5.

Note that UUIDv5 relies on the uniqueness of the given name within the specified namespace. Therefore, it is important to choose a unique and well-defined namespace and ensure that the names used to generate UUIDv5s are unique within that namespace. Alternatively, UUIDv4 or other algorithms may be more suitable for most use cases.