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
    
    return self

end

function input:textInput(t)
    print(t)
    table.insert(self.text, self.cursor, t) 
    self.cursor = self.cursor + 1

end

function input:draw()
    love.graphics.setColor(1,1,1)
    love.graphics.rectangle("fill", self.x, self.y, self.width, self.height, self.border)
    love.graphics.setColor(0,0,0)
    love.graphics.print(table.concat(self.text), self.x, self.y)
end



return input