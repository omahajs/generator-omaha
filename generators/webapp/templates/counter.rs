pub struct Counter {
    val: u32
}

impl Counter {
    pub fn new(val: u32) -> Counter {
        Counter{val: val}
    }
    pub fn get(&self) -> u32 {
        self.val
    }
    pub fn inc(&mut self, by: u32) -> u32 {
        self.val += by;
        self.val
    }
    pub fn dec(&mut self, by: u32) -> u32 {
        self.val -= by;
        self.val
    }
}
