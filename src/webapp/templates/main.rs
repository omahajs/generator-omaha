#![allow(non_snake_case)]

mod counter;

use counter::Counter;
use std::mem::transmute;

#[no_mangle]
pub extern "C" fn addOne(x: i32) -> i32 {
    x + 1
}

#[no_mangle]
pub extern fn createCounter(val: u32) -> *mut Counter {
    let _counter = unsafe { transmute(Box::new(Counter::new(val))) };
    _counter
}

#[no_mangle]
pub extern fn getCounterValue(ptr: *mut Counter) -> u32 {
    let mut _counter = unsafe { &mut *ptr };
    _counter.get()
}

#[no_mangle]
pub extern fn incrementCounter(ptr: *mut Counter, by: u32) -> u32 {
    let mut _counter = unsafe { &mut *ptr };
    _counter.inc(by)
}

#[no_mangle]
pub extern fn decrementCounter(ptr: *mut Counter, by: u32) -> u32 {
    let mut _counter = unsafe { &mut *ptr };
    _counter.dec(by)
}

#[no_mangle]
pub extern fn destroyCounter(ptr: *mut Counter) {
    let _counter: Box<Counter> = unsafe{ transmute(ptr) };
    // Drop
}
