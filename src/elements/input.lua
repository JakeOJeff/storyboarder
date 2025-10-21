local input = {}
input.__index = input

function input:new(x, y, width, padding, font, border)
    local obj = setmetatable({}, self)
    obj.x = x
    obj.y = y
    obj.width = width + (padding * 2)
    obj.height = font:getHeight() + (padding * 2)
    obj.limit = width
    obj.font = font
    obj.border = border or 2
    obj.padding = padding or 4
    obj.text = {}
    obj.cursor = 1
    return obj
end

function input:textInput(t)
    table.insert(self.text, self.cursor, t)
    self.cursor = self.cursor + 1
end

function input:draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.rectangle("fill", self.x, self.y, self.width, self.height, self.border)
    love.graphics.setColor(0, 0, 0)
    love.graphics.setFont(self.font)
    love.graphics.print(table.concat(self.text), self.x + self.padding, self.y + self.padding)
end

return input
