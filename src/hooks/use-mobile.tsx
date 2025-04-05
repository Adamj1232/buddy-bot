
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check
    checkIfMobile()
    
    // Set up event listener for resize
    const handleResize = () => {
      checkIfMobile()
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  // Function to check window width
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }

  return isMobile
}
