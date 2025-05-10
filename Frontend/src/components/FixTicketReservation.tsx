
import { useEffect } from 'react';

// This is a utility component that fixes the ticket reservation functionality
// by patching any potential JavaScript errors in the parent components
const FixTicketReservation = () => {
  useEffect(() => {
    // Find any reserve ticket buttons that might be broken
    const fixReservationButtons = () => {
      try {
        // Using standard DOM methods to find Reserve Ticket buttons
        const buttons = document.querySelectorAll('button');
        const reserveButtons = Array.from(buttons).filter(button => 
          button.textContent && button.textContent.includes('Reserve Ticket')
        );
        
        if (reserveButtons.length > 0) {
          reserveButtons.forEach(button => {
            // Check if button already has a working event handler
            const hasWorkingHandler = button.getAttribute('data-fixed') === 'true';
            if (hasWorkingHandler) return;
            
            // Remove any broken event handlers
            const newButton = button.cloneNode(true) as HTMLElement; // Cast to HTMLElement
            if (button.parentNode) {
              button.parentNode.replaceChild(newButton, button);
              
              // Add a working event handler
              newButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Extract event ID from URL or use a default
                const eventId = window.location.pathname.split('/').pop() || '1';
                console.log("FixTicketReservation: Redirecting to payment confirmation");
                window.location.href = `/confirm-payment?eventId=${eventId}`;
              });
              
              // Mark as fixed - now using HTMLElement which has setAttribute
              newButton.setAttribute('data-fixed', 'true');
            }
          });
        }
      } catch (error) {
        console.error("Error fixing reservation buttons:", error);
      }
    };

    // Run the fix after a short delay to ensure the DOM is fully loaded
    const timeoutId = setTimeout(fixReservationButtons, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything visually
  return null;
};

export default FixTicketReservation;
