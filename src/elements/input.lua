local input = {}

input.__index = input

function input:new(x, y, width, padding, font, border)
    
    self.x = x
    self.y = y
    self.width = x + width+ (padding * 2)
    self.height = y + font:getHeight() + (padding * 2)
    self.limit = width
    self.font = font
    self.border = border
    self.text = {}
    self.cursor = 1
    

end

function input:textInput(t)
    
    table.insert(self.text, self.cursor, t) 
    self.cursor = self.cursor + 1

end



return input