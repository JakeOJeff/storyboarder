local loader = {}
local input = require("src.elements.input")

local fileInput -- declare here

function loader:load()
    fileInput = input:new(20, 20, 200, 5, love.graphics.getFont(), 3)
end

function loader:textinput(t)
    fileInput:textInput(t)
end

function loader:draw()
    fileInput:draw()
end

return loader
