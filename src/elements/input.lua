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
    obj.text = convertText("Untitled")
    obj.cursor = #obj.text + 1
    obj.selected = false
    return obj
end

function input:textInput(t)
    if self.selected then
        table.insert(self.text, self.cursor, t)
        self.cursor = self.cursor + 1
    end
end

function input:mousepressed(x, y, button)
    if button == 1 then
        if x > self.x and x < self.x + self.width and y > self.y and y < self.y + self.height then
            self.selected = true
        else
            self.selected = false
        end
    end

end

function input:keypressed(key)
    if key == "backspace" and self.cursor > 1 then
        if love.keyboard.isDown("control") then
            
        else
            table.remove(self.text, self.cursor - 1)
            self.cursor = self.cursor - 1
        end

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

    if self.selected then
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

end

function convertText(text)
    local t = {}

    for c in text:gmatch(".") do
        table.insert(t, c)
    end

    return t
end

return input
