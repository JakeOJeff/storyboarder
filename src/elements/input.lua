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

function input:keypressed(key)
    if key == "backspace" and self.cursor > 1 then
        table.remove(self.text, self.cursor - 1)
        self.cursor = self.cursor - 1
    end
    if key == "delete" and self.cursor < #self.text + 1 then
        table.remove(self.text, self.cursor)
    end

    if key == "left" then
        if self.cursor > 1 then
            self.cursor = self.cursor - 1
        end
    end

    if key == "right" then
        if self.cursor < #self.text then
            self.cursor = self.cursor + 1
        end
    end
end

function input:draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.rectangle("fill", self.x, self.y, self.width, self.height, self.border)

    love.graphics.setColor(0, 0, 0)
    love.graphics.setFont(self.font)
    love.graphics.print(table.concat(self.text), self.x + self.padding, self.y + self.padding)

    local blinkAlpha = 0.5 + 0.5 * math.sin(love.timer.getTime() * 5)
    local blinkTable = {}
    if self.cursor > 1 then
        table.move(self.text, 1, self.cursor - 1, 1, blinkTable)
    end
    local cursorX = self.x + self.padding + self.font:getWidth(table.concat(blinkTable))
    local cursorY = self.y + self.padding
    local cursorWidth = 2
    local cursorHeight = self.font:getHeight()

    love.graphics.setColor(0, 0, 0, blinkAlpha)
    love.graphics.rectangle("fill", cursorX, cursorY, cursorWidth, cursorHeight)
end

return input
