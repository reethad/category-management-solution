"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronRight, Edit, Trash } from "react-feather"

interface Category {
  id: number
  name: string
  path: string
  level: number
  children: Category[]
}

interface TreeNodeProps {
  category: Category
  onDelete: (id: number) => void
}

const TreeNode: React.FC<TreeNodeProps> = ({ category, onDelete }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const hasChildren = category.children && category.children.length > 0

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <li className="tree-node">
      <div className="flex items-center py-2">
        <div
          className="mr-2 cursor-pointer"
          onClick={toggleExpand}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>

        <span className="flex-grow font-medium">{category.name}</span>

        <div className="flex space-x-2">
          <Link to={`/edit/${category.id}`} className="text-blue-500 hover:text-blue-700" title="Edit category">
            <Edit size={18} />
          </Link>
          <button
            onClick={() => onDelete(category.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete category"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <ul className="pl-6 border-l border-gray-200 ml-2 space-y-2">
          {category.children.map((child) => (
            <TreeNode key={child.id} category={child} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default TreeNode
