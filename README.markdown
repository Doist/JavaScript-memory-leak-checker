Usage
===========

Source memory_leak_checker.js and call from JavaScript::

    MemoryLeakChecker(window)

This will analyze every object and list and output any objects or lists that have over 200 elements. This can be very useful for finding leaks in datastructures.
