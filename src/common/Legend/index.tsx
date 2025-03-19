import React from 'react'

function Legend() {
  return (
    <div className=' relative left-10'>
      <div className="flex items-center mb-2">
        <span className= "  drug-of-choice-legend w-4 h-4  rounded mr-2"></span>
        <span className="text-gray-800">Drug of Choice</span>
      </div>
      <div className="flex items-center">
        <span className="   drug-legend w-4 h-4  rounded mr-2"></span>
        <span className="text-gray-800">Suspected Drug</span>
      </div>
    </div>
  )
}

export default Legend
